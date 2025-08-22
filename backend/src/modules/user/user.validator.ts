import { z } from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

export class UserValidator extends BaseValidator {
    onCreate = z.object({
        username: BaseValidator.mustBeString(true),
        password: BaseValidator.mustBeString(true)
    });

    onUpdate = z.object({
        username: BaseValidator.mustBeString(true),
        password: BaseValidator.mustBeString(true)
    });

    static onLogin = z.object({
        username: BaseValidator.mustBeString(true),
        password: BaseValidator.mustBeString(true),
    })
}