// Socket room name
export const SOCKET_ROOMS = {
    ORDER: "order",
    REQUEST: "request",
} as const;
export type SocketRoom = typeof SOCKET_ROOMS[keyof typeof SOCKET_ROOMS];

// Socket room name
export const SOCKET_EVENTS = {
    ORDER_NEW: "order:new",
    REQUEST_NEW: "request:new",
} as const;
export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// --- order ---
// > order status
export const ORDER_STATUSES = {
    NEW: 0,
    PROCESSING: 1,
    COMPLETED: 2,
    CANCELLED: 3,
}
export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [ORDER_STATUSES.NEW]: "Mới",
    [ORDER_STATUSES.PROCESSING]: "Đang thực hiện",
    [ORDER_STATUSES.COMPLETED]: "Hoàn thành",
    [ORDER_STATUSES.CANCELLED]: "Đã hủy",
};
// > order payment status
export const PAYMENT_STATUSES = {
    UNPAID: 0,
    PAID: 1,
}
// > order scenario
export const ORDER_SCENARIOS = {
    LIST: "list",
};
export type OrderScenario = typeof ORDER_SCENARIOS[keyof typeof ORDER_SCENARIOS];