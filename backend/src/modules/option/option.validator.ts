import {z} from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const createAndUpdateValidator = z.object({
    name: BaseValidator.mustBeString(true),
    multiple: z.boolean().optional(),
    items: z.json(),
});

export class OptionValidator extends BaseValidator {
    onCreate = createAndUpdateValidator
    onUpdate = createAndUpdateValidator
}