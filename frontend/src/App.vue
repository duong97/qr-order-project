<script lang="ts">
import { defineComponent } from 'vue';
import QrtHeader from "@/components/layout/QrtHeader.vue";
import QrtFooter from "@/components/layout/QrtFooter.vue";

export default defineComponent({
    name: 'App',
    components: {
        QrtFooter,
        QrtHeader,
        [QrtHeader.name]: QrtHeader,
    }
});
</script>

<template>
    <QrtHeader />
    <router-view />
    <QrtFooter />
</template>

<style>
</style>
