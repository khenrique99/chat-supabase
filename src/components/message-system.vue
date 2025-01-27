<template>
    <div
        class="fixed bottom-10 left-0 w-full p-4 text-left shadow-md mb-5"
        :class="{ 'bg-green-500': status == 'ok', 'bg-red-500': status == 'denied' }"
    >
        <h1 class="text-white">{{ name }}</h1>
    </div>
</template>

<script setup lang="ts">
interface Props {
    name: string
    status: string
}

defineProps<Props>()
</script>
