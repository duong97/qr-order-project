import { defineStore } from "pinia";
import OrderApiResponse from "@/interface/OrderApiResponse";
import {OrderApi} from "@/api/admin/OrderApi";

const adminOrderApi = new OrderApi();

export const useOrderStore = defineStore("order", {
    state: () => ({
        orders: [] as OrderApiResponse[],
        ordersByStatus: {} as any,
    }),

    actions: {
        // @todo xử lý lại các chỗ dùng orders -> lấy theo orderByStatus
        async fetchOrders(status?: number) {
            if (status !== undefined) {
                this.ordersByStatus[status] = await adminOrderApi.list({ status });
            } else {
                this.orders = await adminOrderApi.list({ status });
            }
        },
        addOrder(order: OrderApiResponse) {
            this.orders.unshift(order);
        },
        async confirmOrder(id?: number|null) {
            if (!id) {
                return null;
            }
            const result = await adminOrderApi.confirm(id);
            if (result) {
                this.replaceOrders(result);
                return result as OrderApiResponse;
            } else {
                return null;
            }
        },
        async completeOrder(id?: number|null) {
            if (!id) {
                return null;
            }
            const result = await adminOrderApi.complete(id);
            if (result) {
                this.replaceOrders(result);
                return result as OrderApiResponse;
            } else {
                return null;
            }
        },
        async cancelOrder(id?: number|null) {
            if (!id) {
                return null;
            }
            const result = await adminOrderApi.cancel(id);
            if (result) {
                this.replaceOrders(result);
                return result as OrderApiResponse;
            } else {
                return null;
            }
        },
        replaceOrders(updatedOrder: OrderApiResponse) {
            const index = this.orders.findIndex(o => o.id === updatedOrder.id);
            if (index !== -1) {
                this.orders[index] = updatedOrder;
            } else {
                this.orders.push(updatedOrder);
            }
        }
    },
});
