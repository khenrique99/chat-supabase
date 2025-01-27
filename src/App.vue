<script setup lang="ts">
import { RouterView } from "vue-router"
import Menu from "@/components/menu.vue"
import Footer from "@/components/footer.vue"
</script>

<template>
    <Menu />
    <RouterView />
    <Footer />
</template>
