<script lang="ts">
import {defineComponent} from "vue";
import {Button, Tabs, Tab} from "vant";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/AuthStore";
import {useOrderStore} from "@/store/OrderStore";
import {UserApi} from "@/api/admin/UserApi";

const userApi = new UserApi();

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
        // Check user login
        userApi.currentUserInfo();

        const authStore = useAuthStore();
        const router = useRouter();
        const orderStore = useOrderStore();
        orderStore.connect();

        return {
            authStore,
            orderStore,
            router,
        }
    },
    methods: {

    }
})
</script>

<template>
    <div id="admin-order-container">
      Connection status: {{ orderStore.connected ? "Connected" : "Connecting..." }}
        <br>
        {{ orderStore.orders }}
    </div>
</template>

<style scoped>

</style>