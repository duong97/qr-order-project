import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z
        .string("Name must be a string")
        .nonempty("Name is required")
        .max(255, { message: 'name must be at most 255 characters' })
    ,
});
