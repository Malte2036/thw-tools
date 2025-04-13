import { z } from 'zod';

export const AddItemSchema = z.object({
  inventarNummer: z
    .string()
    .min(1, { message: 'inventarNummer cannot be empty' }),
});

export type AddItemDto = z.infer<typeof AddItemSchema>;
