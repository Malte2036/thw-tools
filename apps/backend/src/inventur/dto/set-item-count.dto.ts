import { z } from 'zod';

export const SetItemCountSchema = z.object({
  inventarItemId: z
    .string()
    .uuid({ message: 'Invalid Inventar Item ID format' }),
  count: z.number().int().min(0, { message: 'Count must be zero or positive' }),
});

export type SetItemCountDto = z.infer<typeof SetItemCountSchema>;
