import { writable } from 'svelte/store';

export type BannerMessage = {
	message: string;
	autoDismiss: boolean;
};

export const bannerMessage = writable<BannerMessage | undefined>();
