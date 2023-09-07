import { writable } from 'svelte/store';

export type BannerMessage = {
	message: string | HTMLElement;
	autoDismiss:
		| false
		| {
				duration: number;
		  };
};

export const bannerMessage = writable<BannerMessage | undefined>();
