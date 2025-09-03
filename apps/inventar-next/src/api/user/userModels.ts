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

export function userToFriendlyString(user: User | null | undefined): string {
  if (!user) {
    return 'Unbekannt';
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  if (user.lastName) {
    return user.lastName;
  }

  return 'Unbekannt';
}
