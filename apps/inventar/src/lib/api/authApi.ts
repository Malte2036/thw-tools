import { browser } from '$app/environment';
import {
	PUBLIC_KINDE_API_CLIENT,
	PUBLIC_KINDE_DOMAIN,
	PUBLIC_KINDE_REDIRECT_URI
} from '$env/static/public';
import { createKindeBrowserClient } from '@kinde-oss/kinde-typescript-sdk';

let _kindeClient: any = null;

export const getKindeClient = () => {
	if (_kindeClient) {
		return _kindeClient;
	}

	_kindeClient = createKindeBrowserClient({
		authDomain: PUBLIC_KINDE_DOMAIN,
		clientId: PUBLIC_KINDE_API_CLIENT,
		logoutRedirectURL: 'http://localhost:5173',
		redirectURL: PUBLIC_KINDE_REDIRECT_URI
		// audience: 'https://api.thw-tools.de'
		// redirectURL: 'https://7a0d-176-198-201-152.ngrok-free.app/auth/callback',
		// sessionManager: {
		// 	async setSessionItem(itemKey, itemValue) {
		// 		console.log('setSessionItem', itemKey, itemValue);
		// 		localStorage.setItem(itemKey, JSON.stringify(itemValue));
		// 	},
		// 	async getSessionItem(itemKey) {
		// 		const itemValue = localStorage.getItem(itemKey);
		// 		return itemValue ? JSON.parse(itemValue) : null;
		// 	},
		// 	async removeSessionItem(itemKey) {
		// 		localStorage.removeItem(itemKey);
		// 	},
		// 	async destroySession() {
		// 		console.warn('destroySession not working at the moment');
		// 	}
		// }
	});

	return _kindeClient;
};

export const login = async () => {
	if (!browser) {
		console.warn('login: not in browser');
		return;
	}

	const url = await getKindeClient().login();
	window.location.href = url.toString();
};

export const handleRedirectToApp = async () => {
	if (!browser) {
		console.warn('handleRedirectToApp: not in browser');
		return;
	}

	const url = new URL(window.location.toString());
	await getKindeClient().handleRedirectToApp(url);

	const isAuth = await getKindeClient().isAuthenticated();
	if (isAuth) {
		localStorage.setItem('kinde_access_token', await getKindeClient().getToken());
	}
};

export const getUser = async () => {
	const user = await getKindeClient().getUser();
	return user;
};

export const isAuthenticated = () => {
	// return await getKindeClient().isAuthenticated();
	if (getToken()) {
		return true;
	}
};

export const getToken = () => {
	// return await getKindeClient().getToken();
	return localStorage.getItem('kinde_access_token');
};
