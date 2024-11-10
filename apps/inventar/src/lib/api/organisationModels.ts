import { z } from 'zod';

export const UserSchema = z.object({
	_id: z.string(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	picture: z.string().optional()
});
export type User = z.infer<typeof UserSchema>;

export type Organisation = {
	_id: string;
	name: string;
	members: User[];
	inviteCode: string;
};

export const OrganisationSchema = z.object({
	_id: z.string(),
	name: z.string(),
	members: z.array(UserSchema),
	inviteCode: z.string()
});

export const generateInviteLink = (organisation: Organisation): string => {
	return `${window.location.origin}/organisation/join/${organisation.inviteCode}`;
};
