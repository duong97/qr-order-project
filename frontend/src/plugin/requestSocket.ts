import socket from "@/plugin/socket";
import {useRequestStore} from "@/store/RequestStore";
import Request from "@/interface/Request";

const EVENT_SOCKET_CONNECTED = "connect";
const EVENT_JOIN_REQUEST = "join:request";
const EVENT_REQUEST_NEW = "request:new";

export function initRequestSocket() {
    if (!socket.connected) socket.connect();
    const requestStore = useRequestStore();

    // join room order
    socket.emit(EVENT_JOIN_REQUEST);

    // Sau khi kết nối thành công
    socket.on(EVENT_SOCKET_CONNECTED, () => {
        console.log('connected request socket')
    });

    // check has a new order
    socket.on(EVENT_REQUEST_NEW, (data: Request) => {
        console.log('new request: ', data);
        requestStore.addItem(data);
    });
}
