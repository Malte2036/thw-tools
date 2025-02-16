import { BRAND, z } from 'zod';

export type UserId = string & BRAND<'UserId'>;
export const UserIdSchema = z.string().brand<'UserId'>();

export const UserSchema = z.object({
	id: UserIdSchema,
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	picture: z.string().optional()
});
export type User = z.infer<typeof UserSchema>;

export type OrganisationId = string & BRAND<'OrganisationId'>;
export const OrganisationIdSchema = z.string().brand<'OrganisationId'>();

export const OrganisationMemberSchema = z.object({
	userId: UserIdSchema,
	organisationId: OrganisationIdSchema,
	user: UserSchema
});
export type OrganisationMember = z.infer<typeof OrganisationMemberSchema>;

export const OrganisationSchema = z.object({
	id: OrganisationIdSchema,
	name: z.string(),
	members: z.array(OrganisationMemberSchema),
	inviteCode: z.string()
});
export type Organisation = z.infer<typeof OrganisationSchema>;

export const generateInviteLink = (organisation: Organisation): string => {
	return `${window.location.origin}/organisation/join/${organisation.inviteCode}`;
};
