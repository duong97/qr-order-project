import { z } from 'zod';

export abstract class BaseValidator {
    onCreate = z.object({});
    onUpdate = z.object({})
    onDelete = z.object({})
}
