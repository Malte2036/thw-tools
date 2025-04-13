import { z } from 'zod';

export const CreateInventurSessionSchema = z.object({
  einheit: z.string().min(1).max(100),
  // organisationId comes from the request context (UserOrgMiddleware)
});

export type CreateInventurSessionDto = z.infer<
  typeof CreateInventurSessionSchema
>;
