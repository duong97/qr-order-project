import { defineStore } from "pinia";
import socket from "@/plugin/socket";

interface Order {
    id: string;
    userId: string;
    total: number;
}

// Event name
const EVENT_JOIN_ORDER = "join:order";
const EVENT_ORDER_NEW = "order:new";

export const useOrderStore = defineStore("order", {
    state: () => ({
        orders: [] as Order[],
        connected: false,
    }),

    actions: {
        connect() {
            if (!socket.connected) {
                socket.connect();
                this.connected = true;

                // join room order
                socket.emit(EVENT_JOIN_ORDER);

                // check has a new order
                socket.on(EVENT_ORDER_NEW, (data: Order) => {
                    this.orders.push(data);
                });
            }
        },

        disconnect() {
            if (this.connected) {
                socket.off(EVENT_ORDER_NEW);
                socket.disconnect();
                this.connected = false;
            }
        },
    },
});
