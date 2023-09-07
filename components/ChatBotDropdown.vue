<template>
    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }"
        :popper="{ placement: 'bottom-start' }">

        <UButton icon="i-heroicons-ellipsis-horizontal" trailing color="primary" variant="ghost">
            <template #leading>
                <UAvatar :ui="ui" :src="userStore.user.photoURL" :alt="userStore.user.email.charAt(0).toUpperCase()" />
            </template>
        </UButton>
        <template #account="{ item }">
            <div class="text-left text-gray-400">
                <p>
                    Signed in as
                </p>
                <p class="truncate font-medium text-gray-900">
                    {{ item.label }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>
            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto" />
        </template>
    </UDropdown>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const emits = defineEmits(['clear-chat', 'sign-out'])

const ui = {
    background: 'bg-green-700',
    placeholder: "font-medium leading-none text-white truncate",
}

const items = [
    [{
        label: userStore.user.email,
        slot: 'account',
        disabled: true
    }],
    [{
        label: 'Clear Chat',
        icon: 'i-heroicons-trash',
        click: () => {
            clearChat()
        }
    }], [{
        label: 'Sign Out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: () => {
            signOut()
        }
    }]
]

const clearChat = () => {
    emits('clear-chat')
}

const signOut = () => {
    emits('sign-out')
}

</script>
