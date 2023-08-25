<template>
    <div>
        <div class="text-center mt-6">
            <select class="border-2" v-model="selectedAgent" @change="changeAgent">
                <option v-for="agent in agentsList" :key="agent" :value="agent">{{ agent }}</option>
            </select>
        </div>

        <main>
            <!-- Chat display -->
            <article v-for="m in messages" :key="m.id" class="my-4 chat"
                :class="m.role === 'user' ? 'chat-start' : 'chat-end'">
                {{ m.role === "user" ? "You: " : "Assistant: " }}
                {{ m.content }}
            </article>

            <div v-if="error">
                <p class="text-red-500">An error occurred: {{ error.message }}</p>
            </div>
            <div v-if="chatStopped">Chat has been stopped.</div>



            <footer class="fixed bottom-0 border-t w-full bg-slate-100 bg-opacity-95 p-4">
                <!-- Predefined buttons -->
                <button type="button" class="btn" @click="sendPredefinedMessage('Tell me a joke')">Joke</button>
                <button type="button" v-if="messages.length" @click="reloadChat" class="btn">Regenerate</button>
                <button v-if="isLoading" type="button" class="bg-red-500 text-white p-2 rounded"
                    @click="stopChat">StopChat</button>
                <form @submit="handleSubmit">
                    <UInput size="xl" :placeholder="isLoading ? 'Thinking...' : 'Type a question...'" required type="text"
                        v-model="input" color="primary" variant="outline" class="w-full bg-white" :loading="isLoading"
                        :ui="{ icon: { trailing: { pointer: '' } } }">
                        <template #trailing>
                            <UButton color="primary" :variant="input ? 'solid' : 'ghost'" icon="i-heroicons-paper-airplane"
                                type="submit" :disabled="input === ''" />
                        </template>
                    </UInput>
                </form>
            </footer>
        </main>
    </div>
</template>
  
<script setup>
definePageMeta({
    layout: "chat-view"
})
import { useChat } from "ai/vue"

const agentsList = ['General', 'Exercise', 'Cardiology']
const selectedAgent = ref(agentsList[0]); // Set 'General' as the default agent
const chatStopped = ref(false);

const body = computed(() => {
    return { agent: selectedAgent.value }
})

const { messages, input, handleSubmit, setMessages, error, reload, isLoading, stop, append } = useChat({
    api: '/api/chat',
    headers: { 'Content-Type': 'application/json' },
    body: body
})

const changeAgent = () => {
    console.log(`Agent changed to: ${selectedAgent.value}`);
    // Clear the chat messages when the agent is changed
    // By using the setMessages method provided by the useChat composable
    setMessages([]);
};

const reloadChat = async () => {
    chatStopped.value = false;
    await reload();
};

const stopChat = () => {
    stop();
    chatStopped.value = true; // Set the chatStopped ref to true
};

const sendPredefinedMessage = (content) => {
    append({
        content: content,
        role: 'user'
    });
};


</script>