<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserApi } from "@/api/admin/UserApi";
import {
    Tabs,
    Tab,
} from "vant";
import {initOrderSocket} from "@/plugin/orderSocket";
import QrtOrderListByStatus from "@/components/admin/QrtOrderListByStatus.vue";

const ORDER_STATUSES = [
    { id: 0, label: 'Mới' },
    { id: 1, label: 'Đang thực hiện' },
    { id: 2, label: 'Đã hoàn thành' },
    { id: 3, label: 'Đã hủy' },
]
const userApi = new UserApi();

// Check user login
userApi.currentUserInfo();

onMounted(() => {
    initOrderSocket();
});
</script>

<template>
    <div id="order-list" class="p-2">
        <!-- Title -->
        <h4 class="title has-text-centered">Quản lý order</h4>

        <Tabs animated swipe-threshold="3">
            <Tab :title="status.label" :key="status.id" v-for="status in ORDER_STATUSES">
                <QrtOrderListByStatus :status="status.id" :key="status.label"/>
            </Tab>
        </Tabs>

    </div>
</template>

<style scoped>
</style>
