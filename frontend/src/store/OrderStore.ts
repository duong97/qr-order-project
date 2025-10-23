import { defineStore } from "pinia";
import OrderApiResponse from "@/interface/OrderApiResponse";
import {OrderApi} from "@/api/admin/OrderApi";

const adminOrderApi = new OrderApi();

export const useOrderStore = defineStore("order", {
    state: () => ({
        orders: [] as OrderApiResponse[],
        connected: false,
    }),

    actions: {
        async fetchOrders() {
            this.orders = await adminOrderApi.list();
        },
        addOrder(order: OrderApiResponse) {
            this.orders.push(order);
        },
    },
});
