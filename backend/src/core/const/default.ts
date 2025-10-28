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

// --- request ---
export const REQUEST_STATUSES = {
    NEW: 1,
    CONFIRM: 2,
}
export type RequestStatus = typeof REQUEST_STATUSES[keyof typeof REQUEST_STATUSES];
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    [REQUEST_STATUSES.NEW]: "Mới",
    [REQUEST_STATUSES.CONFIRM]: "Đã xác nhận",
};
export const REQUEST_SCENARIOS = {
    LIST: "list",
};
export type RequestScenario = typeof REQUEST_SCENARIOS[keyof typeof REQUEST_SCENARIOS];
// request type
export const REQUEST_TYPES = {
    CALL_STAFF: 1,
    CALL_MANAGER: 2,
    CALL_CHEF: 3,
}
export type RequestType = typeof REQUEST_TYPES[keyof typeof REQUEST_TYPES];
export const REQUEST_TYPE_LABELS: Record<RequestStatus, string> = {
    [REQUEST_TYPES.CALL_STAFF]: "Gọi nhân viên",
    [REQUEST_TYPES.CALL_MANAGER]: "Gọi quản lý",
    [REQUEST_TYPES.CALL_CHEF]: "Gọi đầu bếp",
};