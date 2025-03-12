import { writable } from 'svelte/store';

export type BannerMessage = {
	message: string | HTMLElement;
	autoDismiss:
		| false
		| {
				duration: number;
		  };
	type?: 'info' | 'error';
};

export const bannerMessage = writable<BannerMessage | undefined>();
