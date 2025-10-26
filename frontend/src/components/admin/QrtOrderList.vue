<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserApi } from "@/api/admin/UserApi";
import {
    Tabs,
    Tab,
} from "vant";
import {initOrderSocket} from "@/plugin/orderSocket";
import QrtOrderListByStatus from "@/components/admin/QrtOrderListByStatus.vue";
import { ORDER_STATUSES } from "@/const/default";

const TAB_LIST = [
    { id: ORDER_STATUSES.NEW, label: 'Mới' },
    { id: ORDER_STATUSES.PROCESSING, label: 'Đang thực hiện' },
    { id: ORDER_STATUSES.COMPLETED, label: 'Đã hoàn thành' },
    { id: ORDER_STATUSES.CANCELLED, label: 'Đã hủy' },
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
            <Tab :title="status.label" :key="status.id" v-for="status in TAB_LIST">
                <QrtOrderListByStatus :status="status.id" :key="status.label"/>
            </Tab>
        </Tabs>

    </div>
</template>

<style scoped>
</style>
