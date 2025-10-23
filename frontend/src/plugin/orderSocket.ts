import socket from "@/plugin/socket";
import OrderApiResponse from "@/interface/OrderApiResponse";
import {useOrderStore} from "@/store/OrderStore";

const EVENT_SOCKET_CONNECTED = "connect";
const EVENT_JOIN_ORDER = "join:order";
const EVENT_ORDER_NEW = "order:new";

export function initOrderSocket() {
    if (!socket.connected) socket.connect();
    const orderStore = useOrderStore();

    // join room order
    socket.emit(EVENT_JOIN_ORDER);

    // Sau khi kết nối thành công
    socket.on(EVENT_SOCKET_CONNECTED, () => {
        console.log('connected')
    });

    // check has a new order
    socket.on(EVENT_ORDER_NEW, (data: OrderApiResponse) => {
        console.log('new order: ', data);
        // add order
        orderStore.addOrder(data);
    });
}
