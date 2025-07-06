<script lang="ts">
import { defineComponent } from 'vue';
import Header from "@/components/layout/Header.vue";
import QrtHeader from "@/components/layout/Header.vue";
import QrtFooter from "@/components/layout/Footer.vue";

export default defineComponent({
    name: 'App',
    components: {
        QrtFooter,
        QrtHeader,
        [Header.name]: Header,
    }
});
</script>

<template>
    <qrt-header />
    <router-view />
    <qrt-footer />
</template>

<style>
</style>
