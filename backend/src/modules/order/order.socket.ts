import { Server, Socket } from "socket.io";

export const registerOrderSocket = (io: Server, socket: Socket) => {
    // Ví dụ: admin join vào room riêng
    socket.on("new-order", () => {
        socket.join("new-order");
        console.log("New order rêceived");
    });
};
