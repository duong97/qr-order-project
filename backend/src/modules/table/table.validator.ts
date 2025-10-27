import { z } from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const nameValidator = z.object({
    name: BaseValidator.mustBeString(true)
});
export class TableValidator extends BaseValidator {
    onCreate = nameValidator
    onUpdate = nameValidator
}
