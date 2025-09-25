import { defineStore } from "pinia";
import socket from "@/plugin/socket";

interface Order {
    id: string;
    userId: string;
    total: number;
}

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

                // Lắng nghe sự kiện
                socket.on("order:created", (data: Order) => {
                    this.orders.push(data);
                });
            }
        },

        disconnect() {
            if (this.connected) {
                socket.off("order:created");
                socket.disconnect();
                this.connected = false;
            }
        },

        createOrder(payload: { userId: string; items: string[] }) {
            socket.emit("order:create", payload);
        },
    },
});
