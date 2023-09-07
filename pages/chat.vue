<template>
    <nav class="fixed z-10 top-0 w-full border-b px-4 py-1 bg-white bg-opacity-90">
        <div class="flex justify-between items-center">
            <NuxtLink to="/" class="flex items-center">
                <NuxtImg provider="imagekit" src="logo.png" width="26" height="26" alt="Modern Med Life logo"
                    densities="x1 x2" class="mr-2" />
                <span class="self-center text-lg sm:text-xl font-semibold whitespace-nowrap">Modern Med Life</span>
            </NuxtLink>
            <div class="w-64 hidden sm:block">
                <ChatBotAgentSelect @update-agent="changeAgent" :messages="messages" :disabled="isLoading" />
            </div>
            <ChatBotDropdown @clear-chat="clearChat" @sign-out="signOut" />

        </div>
        <!-- Select menu for xs screen size -->
        <div class="block sm:hidden">
            <ChatBotAgentSelect class="w-full" @update-agent="changeAgent" :messages="messages" :disabled="isLoading" />
        </div>
    </nav>

    <main ref="chatContainer" class="overflow-y-auto w-full pb-16 px-4 bg-slate-300 min-h-screen"
        :class="messages.length === 0 ? 'flex flex-col pt-32 md:pt-0 md:justify-center md:self-center' : ''">
        <aside id="messagesPlaceholder" v-if="messages.length === 0" class="text-center text-slate-900">
            <!-- <img src="avatar.jpg" alt="No messages" class="w-1/2 mx-auto" /> -->
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis-solid" class="text-4xl text-slate-600" />
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-2xl">Chat with an expert AI that
                only responds using peer-reviewed sources.
            </h1>
            <h2 class="mx-auto mt-6 md:mt-3 max-w-xl text-md leading-5">Choose a chat context
                <UIcon name="i-heroicons-bolt-solid" class="w-4 h-4 text-yellow-600" /> above to ensure responses use
                rigorous,
                peer-reviewed sources specific
                to your topic.
            </h2>
            <!-- <p class="italic">Hallucinations are effectively eliminated.</p> -->

            <UButton class="md:hidden lg:inline-block mt-2" @click="isOpen = true" color="gray" size="sm" variant="soft">
                Learn More
            </UButton>

        </aside>
        <section class="pt-20" v-else>
            <article class="my-4" :class="message.role === 'user' ? 'chat chat-start' : 'chat chat-end'"
                v-for="message in  messages " :key="message.id">
                <template v-if="message.role === 'user'">
                    <div class="chat-image avatar">
                        <div class="w-8 rounded-full">
                            <UAvatar :ui="{ background: 'bg-green-700', placeholder: 'text-white' }" size="sm"
                                :src="userStore.user.photoURL" width="32" height="32" loading="lazy"
                                :alt="userStore.user.email.charAt(0).toUpperCase()" />
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="chat-image avatar">
                        <div class="w-8 rounded-full">
                            <NuxtImg loading="lazy" provider="imagekit" src="logo.png" width="32" height="32"
                                aria-label="chatbot avatar" v-show="message.role !== 'user'" densities="x1 x2" />
                        </div>
                    </div>
                </template>
                <div class="chat-bubble rounded-md prose prose-p:my-3"
                    :class="message.role === 'user' ? 'text-white' : message.role === 'system' ? 'chat-bubble-error text-white italic font-semibold' : 'bg-white'">
                    <template v-if="messageBeingEdited && messageBeingEdited.id === message.id">
                        <form @submit.prevent="submitEdit">
                            <UTextarea size="xl" color="gray" variant="outline" autoresize
                                v-model="messageBeingEdited.content" required />
                            <div class="mt-2 text-center">
                                <UButton type="submit" color="teal" variant="solid">Submit</UButton>
                                <UButton color="white" variant="soft" @click="cancelEdit">Cancel</UButton>
                            </div>
                        </form>
                    </template>
                    <template v-else>
                        <Markdown :source="message.content" />
                    </template>
                </div>


                <footer class="chat-footer opacity-50">
                    <UButton v-if="message.role === 'user' && !messageBeingEdited" @click="editMessage(message.id)"
                        icon="i-heroicons-pencil-square" size="xs" color="primary" square variant="ghost" />
                    <span v-if="message.role === 'assistant' && chatStopped" class="text-red-600 italic font-bold">Chat
                        was
                        stopped by
                        user</span>
                </footer>

            </article>
            <div v-if="error">
                <p class="text-red-500">An error occurred: {{ error.message }}</p>
            </div>
        </section>
    </main>

    <footer class="fixed bottom-0 w-full px-4 pb-2">
        <template v-if="!messagesExist">
            <!-- up to sm viewports -->
            <aside class="grid md:hidden w-full grid-flow-row grid-cols-1 gap-2">
                <button v-for=" msg  in  predefinedMessages.slice(0, 2) " :key="msg.id"
                    class="relative w-full whitespace-normal md:whitespace-nowrap rounded-lg text-start p-4 border border-slate-400 hover:bg-base-100 hover:bg-opacity-25"
                    type="button" @click="sendPredefinedMessage(msg)">
                    <h5 class="truncate text-sm tracking-tight font-semibold text-gray-900">{{ msg.title }}</h5>
                    <p class="truncate text-sm text-gray-500">{{ msg.description }}</p>
                </button>
            </aside>
            <aside class="hidden md:grid lg:hidden w-full grid-flow-row grid-cols-3 gap-2">
                <button v-for=" msg  in  predefinedMessages.slice(0, 3) " :key="msg.id"
                    class="relative w-full whitespace-normal md:whitespace-nowrap rounded-lg text-start p-4 border border-slate-400 hover:bg-base-100 hover:bg-opacity-25"
                    type="button" @click="sendPredefinedMessage(msg)">
                    <h5 class="truncate text-sm tracking-tight font-semibold text-gray-900">{{ msg.title }}</h5>
                    <p class="truncate text-sm text-gray-500">{{ msg.description }}</p>
                </button>
            </aside>
            <!-- lg and up -->
            <aside class="hidden lg:grid w-full grid-flow-row grid-cols-4 gap-2">
                <button v-for=" msg  in  predefinedMessages " :key="msg.id"
                    class="relative w-full whitespace-normal md:whitespace-nowrap rounded-lg text-start p-4 border border-slate-400 hover:bg-base-100 hover:bg-opacity-25"
                    type="button" @click="sendPredefinedMessage(msg)">
                    <h5 class="truncate text-sm tracking-tight font-semibold text-gray-900">{{ msg.title }}</h5>
                    <p class="truncate text-sm text-gray-500">{{ msg.description }}</p>
                </button>
            </aside>

        </template>
        <div class="text-end mb-2">
            <UButtonGroup size="sm">
                <UButton v-if="isLoading" icon="i-heroicons-stop" label="Stop" @click="stopChat" color="primary"
                    variant="outline" :disabled="false" />
                <UButton v-if="messagesExist && !isLoading" @click="reloadChat" label="Regenerate"
                    icon="i-heroicons-arrow-path" color="primary" variant="outline" />
                <UButton v-if="messagesExist" @click="clearChat" icon="i-heroicons-trash" color="primary"
                    variant="outline" />
            </UButtonGroup>
        </div>
        <form @submit.prevent="handleCustomSubmit">
            <UInput size="xl" :placeholder="isLoading ? 'Thinking...' : 'Type a question...'" required type="text"
                v-model="input" color="primary" variant="outline" class="border w-full bg-white" :loading="isLoading"
                :ui="{ icon: { trailing: { pointer: '' } } }" :disabled="isLoading">
                <template #trailing>
                    <UButton color="primary" :variant="input ? 'solid' : 'ghost'" icon="i-heroicons-paper-airplane"
                        type="submit" :disabled="input === ''" />
                </template>
            </UInput>
        </form>
    </footer>
    <ChatBotModal v-model="isOpen" @close-modal="isOpen = false" />
</template>
  
<script setup>
definePageMeta({
    layout: 'chatbot',
    // middleware: 'auth'
});
useSeoMeta({
    title: 'Chat with an expert AI on health and longevity topics.',
    description: 'Get expert advice on your longevity topics from a free AI chatbot'
});

import { useChat } from "ai/vue"
import { useUserStore } from '@/stores/user'
import Markdown from 'vue3-markdown-it';

const userStore = useUserStore()
const chatContainer = ref(null);
const isOpen = ref(false) // modal state
const selectedAgent = ref('Exercise'); // Set 'Exercise' as the default agent
const chatStopped = ref(false);

const body = computed(() => {
    return { agent: selectedAgent.value }
})

const messagesExist = computed(() => {
    return messages.value.length > 0;
})

const { messages, input, handleSubmit, setMessages, error, reload, isLoading, stop, append } = useChat({
    api: '/api/chat',
    headers: { 'Content-Type': 'application/json' },
    body: body
})

const changeAgent = (newAgentId) => {
    console.log('from parent: ', newAgentId)
    selectedAgent.value = newAgentId
    clearChat()
    // if (messages.value.length > 0) {
    //     // Confirm with the user before changing the agent and clearing the chat
    //     if (window.confirm('Changing the agent will clear the chat. Do you want to continue?')) {
    //         selectedAgent.value = newAgent; // Update the selected agent
    //         clearChat(); // Clear the chat messages
    //     }
    // } else {
    //     // If there are no chat messages, go ahead and change the agent
    //     selectedAgent.value = newAgent; // Update the selected agent
    // }
}

const clearChat = () => {
    chatStopped.value = false
    setMessages([]);
}

const reloadChat = async () => {
    chatStopped.value = false;
    await reload();
};

// const stopChat = () => {
//     stop();
//     chatStopped.value = true;
// };

const stopChat = () => {
    stop();
    chatStopped.value = true
    // append({
    //     content: 'Chat has been stopped by user.',
    //     role: 'system'
    // });
};

const messageBeingEdited = ref(null);

const editMessage = (id) => {
    const message = messages.value.find(msg => msg.id === id);
    if (message && message.role === 'user') {
        originalMessageContent.value = message.content; // Store original content
        messageBeingEdited.value = message;
    }
};


const submitEdit = async () => {
    // Find the index of the message being edited
    const index = messages.value.findIndex(msg => msg.id === messageBeingEdited.value.id);

    // Truncate messages after the edited one and append the edited message
    const truncatedMessages = messages.value.slice(0, index);
    truncatedMessages.push(messageBeingEdited.value);

    // Update the messages state
    setMessages(truncatedMessages);

    // Reset the messageBeingEdited
    messageBeingEdited.value = null;

    // Clear chat stopped message if any
    chatStopped.value = false

    // Optionally reload the chat to reflect the changes
    await reload();
};

const originalMessageContent = ref(null);

const cancelEdit = () => {
    if (messageBeingEdited.value) {
        messageBeingEdited.value.content = originalMessageContent.value; // Restore original content
    }
    messageBeingEdited.value = null;
    originalMessageContent.value = null; // Clear stored original content
};



const handleCustomSubmit = async (e) => {
    chatStopped.value = false
    const inputValue = input.value;
    if (!inputValue) return;

    if (!messageBeingEdited.value) {
        handleSubmit(e);
    }

    // Clear the input field
    input.value = '';
};


// Create a mapping of agents to predefined messages
const agentPredefinedMessages = ref({
    'Exercise': [{ id: 1, title: 'Create a Zone 2 training plan for me', description: 'based on the latest science', prompt: 'Create me a Zone 2 training plan tailor made for me based on latest science. What do you need to know to help me?' }, { id: 2, title: 'Help me improve my VO2 max', description: 'and increase my longevity', prompt: 'Help me improve my VO2 max and increase my longevity. What do you need to know to help me?' }, { id: 3, title: 'Help me maximize muscle growth', description: 'in the shortest amount of time possible', prompt: 'Help me maximize muscle growth in the shortest time possible. What do you  need to know to help me?' }],
    // 'Cardiology': [{ id: 1, title: 'What is ApoB?', description: 'some short sentence can go here' }, { id: 2, title: 'Recommended blood pressure ranges', description: 'some short sentence can go here' }],
    'Cardiology': [{ id: 1, title: 'What causes heart disease?', description: 'the #1 killer in the world', prompt: 'What causes heart disease?' }, { id: 2, title: 'What is ApoB ', description: 'and why it\'s the secret to heart health', prompt: 'What is ApoB? What does the science say?' }],
    'General': [{ id: 2, title: 'What is medicine 3.0?', description: 'and why is it vital for longevity', prompt: 'What is meant by medicine 3.0' }, { id: 3, title: 'What age to get a colonoscopy?', description: 'what does the latest science say', prompt: 'At what age should a person get a colonoscopy?' },]
});

// Update predefined messages based on selected agent
const predefinedMessages = computed(() => {
    return agentPredefinedMessages.value[selectedAgent.value] || [];
});

const sendPredefinedMessage = (content) => {
    append({
        content: content.prompt,
        role: 'user'
    });
};

const signOut = () => {
    userStore.signOut()
}

watchEffect(() => {
    if (messages.value.length > 0) {
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage.role !== 'user') {
            nextTick(() => {
                const chatBubbles = chatContainer.value.getElementsByClassName('chat-bubble');
                const lastChatBubble = chatBubbles[chatBubbles.length - 1];
                if (lastChatBubble) {
                    lastChatBubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            });
        }
    }
}, {
    flush: 'post',
});




</script>