import { z } from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const createAndUpdateValidator = z.object({
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
export class UserValidator extends BaseValidator {
    onCreate = createAndUpdateValidator
    onUpdate = createAndUpdateValidator

    static onLogin = z.object({})
}