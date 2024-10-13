import type { User } from './funkModels';

export type Organisation = {
	_id: string;
	name: string;
	members: User[];
	inviteCode: string;
};

export const generateInviteLink = (organisation: Organisation): string => {
	return `${window.location.origin}/organisation/join/${organisation.inviteCode}`;
};
