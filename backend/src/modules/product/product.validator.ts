import {z} from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const createAndUpdateValidator = z.object({
    name: BaseValidator.mustBeString(true),
    price: BaseValidator.mustBeNumber(true),
    description: BaseValidator.mustBeString(),
});

export class ProductValidator extends BaseValidator {
    onCreate = createAndUpdateValidator
    onUpdate = createAndUpdateValidator
}