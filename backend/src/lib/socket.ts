import { Server } from "socket.io";
import {registerOrderSocket} from "@/modules/order/order.socket";
import {socketAuthMiddleware} from "@/core/middleware/socketAuth";

let io: Server;

export const initSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: { origin: "*" }, // chỉnh domain FE thật sự
    });

    // Authentication
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);

        registerOrderSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("⚠️ Socket.IO chưa được khởi tạo");
    }
    return io;
};