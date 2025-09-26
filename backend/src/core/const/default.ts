// Socket room name
export const SOCKET_ROOMS = {
    ORDER: "order",
} as const;
export type SocketRoom = typeof SOCKET_ROOMS[keyof typeof SOCKET_ROOMS];

// Socket room name
export const SOCKET_EVENTS = {
    ORDER_NEW: "order:new",
} as const;
export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];