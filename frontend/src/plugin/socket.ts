import { io, Socket } from "socket.io-client";
import config from "@/config";

// Tạo socket với type an toàn
const socket: Socket = io(
    config.cfConfig.socketUrl as string,
    {
        transports: ["websocket"],
        autoConnect: false, // chỉ connect khi cần
    }
);

export default socket;
