<template>
    <USelectMenu placeholder="Select chat context..." color="gray" variant="outline" :options="agents" required
        :value="selected" @change="handleAgentUpdate($event)">
        <template #label>
            <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4 text-yellow-500" />
            {{ selected.label }}
        </template>
    </USelectMenu>
</template>

<script setup>
const props = defineProps({
    messages: {
        type: Array,
        required: true,
    },
});

const emits = defineEmits(['update-agent']);

const agents = [
    {
        id: "General",
        label: "General",
    },
    {
        id: "Cardiology",
        label: "Cardiology",
        // disabled: true,
        icon: "i-heroicons-bolt-solid",
    },
    {
        id: "Nutrition",
        label: "Nutrition (Coming Soon)",
        disabled: true,
        icon: "i-heroicons-bolt-solid",
    },
    {
        id: "Exercise",
        label: "Exercise",
        icon: "i-heroicons-bolt-solid",
    },
];

const selected = ref(agents[3]);

const handleAgentUpdate = (event) => {
    console.log(1, event.id)
    if (props.messages.length > 0) {
        console.log(2, event.id)
        const result = window.confirm('Changing the agent will clear the chat. Do you want to continue?')
        if (result) {
            selected.value = event
            emits('update-agent', selected.value.id)
        } else {
            return
        }
    } else {
        console.log(3, event.id)
        selected.value = event
        emits('update-agent', event.id)
    }

}

</script>