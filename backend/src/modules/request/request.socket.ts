import { Server } from "socket.io";
import {SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";
import {AuthenticatedSocket} from "@/core/middleware/socketAuth";

const roomRequest = SOCKET_ROOMS.REQUEST;

export const registerRequestSocket = (io: Server, socket: AuthenticatedSocket) => {
    // Join room order on demand
    const joinRequest = ["join", roomRequest].join(':');
    console.log('Handling request socket...');
    socket.on(joinRequest, () => {
        console.log(`Client joined room ${roomRequest}`);
        socket.join(roomRequest);
    });
};
