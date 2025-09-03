import { BRAND, z } from 'zod';

export type UserId = string & BRAND<'UserId'>;
export const UserIdSchema = z.string().brand<'UserId'>();

export const UserSchema = z.object({
  id: UserIdSchema,
  kindeId: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  picture: z.string().nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;
