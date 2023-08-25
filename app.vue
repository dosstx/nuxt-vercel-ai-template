<template>
  <div>
    <div class="text-center mt-6">
      <select class="border border-2" v-model="selectedAgent" @change="changeAgent">
        <option v-for="agent in agentsList" :key="agent" :value="agent">{{ agent }}</option>
      </select>
      <br />
      Selected agent: {{ selectedAgent }}
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-indicator">
      Loading...
    </div>

    <div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <!-- Chat display -->
      <div v-for="m in messages" :key="m.id" class="whitespace-pre-wrap">
        {{ m.role === "user" ? "User: " : "AI: " }}
        {{ m.content }}
      </div>
      <!-- Predefined buttons -->
      <button @click="sendPredefinedMessage('How is the weather today?')">Weather</button>
      <button @click="sendPredefinedMessage('Tell me a joke')">Joke</button>

      <div v-if="error">
        <p class="text-red-500">An error occurred: {{ error.message }}</p>
      </div>
      <div v-if="chatStopped">Chat has been stopped.</div>

      <button type="button" v-if="messages.length" @click="reloadChat"
        class="bg-blue-500 text-white p-2 rounded">Regenerate
      </button>
      <button v-if="isLoading" type="button" class="bg-red-500 text-white p-2 rounded" @click="stopChat">Stop
        Chat</button>


      <form @submit="handleSubmit">
        <input class="w-full max-w-md p-2 mb-8 border border-4 rounded" v-model="input" placeholder="Say something..." />
      </form>
    </div>
  </div>
</template>

<script setup>
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