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
                        status: 'fail',
                        message: 'Validation error',
                        errors: err.issues,
                    });
                }

                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation error',
                    errors: err.message || "Unexpected error",
                });
            }
        };
