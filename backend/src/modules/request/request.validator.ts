import {z} from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

const requestSchema = z.object({
    note: BaseValidator.mustBeString(false),
    tableId: BaseValidator.mustBeNumber(true),
    type: BaseValidator.mustBeNumber(true),
});

export class RequestValidator extends BaseValidator {
    onCreate = requestSchema
    onUpdate = requestSchema
}

export type CreateRequestInput = z.infer<typeof requestSchema>;