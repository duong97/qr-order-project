import { Request, Response, NextFunction } from 'express'

// App error
export class AppError extends Error {
    public statusCode: number
    public isOperational: boolean
    public details?: any

    constructor(message: string, statusCode = 500, isOperational = true, details?: any) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.details = details
        Error.captureStackTrace(this, this.constructor)
    }
}

// Authentication error
export class AuthError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

// Validation error
export class ValidationError extends AppError {
    public errors?: any

    constructor(errors: any) {
        super('Validation failed', 400);
        this.errors = errors;
    }
}

// Signature error
export class SignatureError extends AppError {
    constructor(message = 'Invalid signature') {
        super(message, 400);
    }
}

export function errorHandler(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err instanceof AppError ? err.statusCode : 500

    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ Error:', err)
    }

    if (err instanceof AuthError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || "Validation failed",
            errors: err.errors,
        });
    }

    if (err instanceof SignatureError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || "Invalid signature",
        });
    }

    // App error
    return res.status(statusCode).json({
        success: false,
        message: 'Internal Server Error',
    })
}
