import { goto } from '$app/navigation';
import { App } from '@capacitor/app';

export const trailingSlash = 'always';
export const prerender = true;

App.addListener('backButton', ({ canGoBack }) => {
	if (canGoBack) {
		history.back();
	} else {
		goto('/');
	}
});
