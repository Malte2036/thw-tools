import { z } from 'zod';

export const ValidateItemQuerySchema = z.object({
  inventarItemId: z
    .string()
    .uuid({ message: 'Invalid Inventar Item ID format' }),
  // We'll get organisationId from the user context or session data, not the query
});

export type ValidateItemQueryDto = z.infer<typeof ValidateItemQuerySchema>;
