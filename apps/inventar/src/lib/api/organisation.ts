import type { User } from './funkModels';

import { z } from 'zod';
import { UserSchema } from './funkModels'; // Assuming UserSchema is defined in funkModels

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
