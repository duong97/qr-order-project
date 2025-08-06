import { z } from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const nameValidator = z.object({
    name: z
        .string("Name must be a string")
        .nonempty("Name is required")
        .max(255, { message: 'name must be at most 255 characters' })
    ,
});
export class CategoryValidator extends BaseValidator {
    onCreate = nameValidator
    onUpdate = nameValidator
}
