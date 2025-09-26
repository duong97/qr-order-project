import { Server, Socket } from "socket.io";
import {SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";

const roomOrder = SOCKET_ROOMS.ORDER;
const eventOrderNew = SOCKET_EVENTS.ORDER_NEW;

export const registerOrderSocket = (io: Server, socket: Socket) => {
    // Join room order on demand
    socket.on(["join", roomOrder].join(':'), () => {
        socket.join(roomOrder);
        console.log(`User ${socket.id} joined room ${roomOrder}`);
    });

    // Ví dụ: admin join vào room riêng
    socket.on(eventOrderNew, (data) => {
        console.log("New order received: ", data);

        // Send event to all clients
        io.to(roomOrder).emit(eventOrderNew, data);
    });
};
