// Socket room name
export const SOCKET_ROOMS = {
    ADMIN: "admin",
    CLIENT: "client",
} as const;
export type SocketRoom = typeof SOCKET_ROOMS[keyof typeof SOCKET_ROOMS];

// Socket room name
export const SOCKET_EVENTS = {
    NEW_ORDER: "new-order",
} as const;
export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];