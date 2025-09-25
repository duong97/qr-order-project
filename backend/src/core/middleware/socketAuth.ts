import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number
    username: string
    role?: string
    // thêm các field khác nếu cần
}

export interface AuthenticatedSocket extends Socket {
    user?: JwtPayload;
}

export function socketAuthMiddleware(socket: AuthenticatedSocket, next: (err?: Error) => void) {
    try {
        const token = socket.handshake.auth.token as string | undefined;

        if (!token) {
            return next(new Error("No token provided"));
        }
        const secret = process.env.JWT_SECRET || 'default_secret'
        const decoded = jwt.verify(token, secret) as JwtPayload;
        if (!decoded) {
            return next(new Error("Invalid or expired token."));
        }

        socket.user = decoded;
        next();
    } catch (err) {
        return next(new Error("Invalid or expired token"));
    }
}
