import {NextFunction, Request, Response} from 'express'
import {AuthError} from './errorHandler'
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string
    role?: string
    // thêm các field khác nếu cần
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthError("Authentication fail: missing token"));
    }

    // const apiKey = req.headers["x-api-key"] || '';
    // if (!apiKey) {
    //     return next(new AuthError("Authentication fail: missing token"));
    // }
    // next();

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET || 'default_secret'
        req.user = jwt.verify(token, secret) as JwtPayload
        next()
    } catch (error) {
        return next(new AuthError('Authentication fail: invalid token'))
    }
}
