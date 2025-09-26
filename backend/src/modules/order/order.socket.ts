import { Server } from "socket.io";
import {SOCKET_ROOMS} from "@/core/const/default";
import {AuthenticatedSocket} from "@/core/middleware/socketAuth";

const roomOrder = SOCKET_ROOMS.ORDER;

export const registerOrderSocket = (io: Server, socket: AuthenticatedSocket) => {
    // Join room order on demand
    const joinOrder = ["join", roomOrder].join(':');
    console.log('Handling order socket...');
    socket.on(joinOrder, () => {
        console.log(`Client joined room ${roomOrder}`);
        socket.join(roomOrder);
    });
};
