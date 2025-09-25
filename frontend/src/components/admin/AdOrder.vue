<script lang="ts">
import {defineComponent} from "vue";
import {Button, Tabs, Tab} from "vant";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/AuthStore";
import {useOrderStore} from "@/store/OrderStore";

export default defineComponent({
    name: "qrt-admin-order",
    components: {
        [Button.name]: Button,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
    },
    data() {
        return {

        }
    },
    // mounted() {
    //     const orderStore = useOrderStore();
    //     orderStore.connect();
    // },
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const orderStore = useOrderStore();
        orderStore.connect();

        return {
            authStore,
            router,
        }
    },
    methods: {

    }
})
</script>

<template>
    <div id="admin-order-container">
      Order ne
    </div>
</template>

<style scoped>

</style>