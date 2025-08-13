import { z } from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

export class UserValidator extends BaseValidator {
    onCreate = z.object({
        username: z
            .string("Name must be a string")
            .nonempty("Name is required")
            .max(255, { message: 'name must be at most 255 characters' })
        ,
        password: z
            .string("Password must be a string")
            .nonempty("Password is required")
            .max(255, { message: 'name must be at most 255 characters' })
    });
    onUpdate = z.object({
        username: z
            .string("Name must be a string")
            .max(255, { message: 'name must be at most 255 characters' })
            .optional()
        ,
        password: z
            .string("Password must be a string")
            .max(255, { message: 'name must be at most 255 characters' })
            .optional()
    });

    static onLogin = z.object({
        username: z
            .string("Username is required")
            .nonempty("Username is required")
            .max(255, { message: 'Username must be at most 255 characters' })
        ,
        password: z
            .string("Password is required")
            .nonempty("Password is required")
            .max(255, { message: 'Password must be at most 255 characters' })
        ,
    })
}