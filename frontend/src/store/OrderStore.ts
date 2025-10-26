import { defineStore } from "pinia";
import OrderApiResponse from "@/interface/OrderApiResponse";
import {OrderApi} from "@/api/admin/OrderApi";
import {ORDER_STATUSES} from "@/const/default";

const adminOrderApi = new OrderApi();
interface OrderByStatus {
    statusId: number;
    orders: OrderApiResponse[];
}

export const useOrderStore = defineStore("order", {
    state: () => ({
        ordersByStatus: [] as OrderByStatus[],
    }),

    actions: {
        async fetchOrders(status?: number) {
            if (status !== undefined) {
                const _orders = {
                    statusId: status,
                    orders: await adminOrderApi.list({ status })
                }
                // Remove old list
                this.ordersByStatus = this.ordersByStatus.filter((o) => o.statusId !== status);
                // Insert new list
                this.ordersByStatus.push(_orders);
            }
        },
        addOrder(order: OrderApiResponse) {
            const _orderStatus = order.orderStatus || ORDER_STATUSES.NEW
            const _ordersByStatus = this.ordersByStatus.find(o => o.statusId === _orderStatus);
            if (_ordersByStatus !== undefined) {
                _ordersByStatus.orders.unshift(order); // thêm vào đầu danh sách
            }
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
            // Remove old order
            for (const _orderByStatus of this.ordersByStatus) {
                _orderByStatus.orders = _orderByStatus.orders.filter(o => o.id !== updatedOrder.id);
            }
            // Add new order
            this.addOrder(updatedOrder);
        }
    },
});
