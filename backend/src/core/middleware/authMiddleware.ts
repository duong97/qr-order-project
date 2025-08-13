import {NextFunction, Request, Response} from 'express'
import {AuthError} from './errorHandler'
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number
    username: string
    role?: string
    // thêm các field khác nếu cần
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthError("Authentication fail: missing token"));
    }

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET || 'default_secret'
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.currentUser = {
            id: decoded.id,
            username: decoded.username,
        }
        next()
    } catch (error) {
        return next(new AuthError('Authentication fail: invalid token'))
    }
}
