<template>
    <div>
        <slot></slot>
    </div>
</template>

<script setup>
// Tailwind suggests to use the below properties for the html and body tags in this layout
useHead({
    htmlAttrs: {
        class: 'h-full bg-gray-50'
    },
    bodyAttrs: {
        class: 'h-full'
    }
})
</script>

