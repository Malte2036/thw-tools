import { BRAND, z } from 'zod';
import { UserIdSchema, UserSchema } from '../user/userModels';

export type OrganisationId = string & BRAND<'OrganisationId'>;
export const OrganisationIdSchema = z.string().brand<'OrganisationId'>();

export const OrganisationMemberSchema = z.object({
  userId: UserIdSchema,
  organisationId: OrganisationIdSchema,
  user: UserSchema,
});
export type OrganisationMember = z.infer<typeof OrganisationMemberSchema>;

export const OrganisationSchema = z.object({
  id: OrganisationIdSchema,
  name: z.string(),
  members: z.array(OrganisationMemberSchema),
  inviteCode: z.string(),
});
export type Organisation = z.infer<typeof OrganisationSchema>;
