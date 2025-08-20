import { Request, Response, NextFunction } from 'express';
import {ZodError, ZodSchema} from 'zod';

export const validate =
    (schema: ZodSchema<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            // Chỉ validate khi create / update
            if (req.method !== 'POST' && req.method !== 'PUT') {
                return next();
            }

            try {
                req.body = schema.parse(req.body);
                next();
            } catch (err: any) {
                if (err instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        errors: err.issues,
                        message: "Validation error!"
                    });
                }

                return res.status(400).json({
                    success: false,
                    data: null,
                    message: err.message || "Unexpected error",
                    errors: err.issues || [],
                });
            }
        };
