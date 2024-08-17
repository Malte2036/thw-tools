import { browser } from '$app/environment';
import {
	PUBLIC_KINDE_API_CLIENT,
	PUBLIC_KINDE_DOMAIN,
	PUBLIC_KINDE_REDIRECT_URI
} from '$env/static/public';
import { createKindeBrowserClient } from '@kinde-oss/kinde-typescript-sdk';
import { SessionStorageBrowserSessionManager } from './sessionManager';

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
		// redirectURL: 'https://7a0d-176-198-201-152.ngrok-free.app/auth/callback'
		// sessionManager: {
		// 	setSessionItem(itemKey, itemValue) {
		// 		console.log('setSessionItem', itemKey, itemValue);
		// 		localStorage.setItem(itemKey, JSON.stringify(itemValue));
		// 		return Promise.resolve();
		// 	},
		// 	getSessionItem(itemKey) {
		// 		const itemValue = localStorage.getItem(itemKey);
		// 		return Promise.resolve(itemValue ? JSON.parse(itemValue) : null);
		// 	},
		// 	removeSessionItem(itemKey) {
		// 		localStorage.removeItem(itemKey);
		// 		return Promise.resolve();
		// 	},
		// 	destroySession() {
		// 		console.warn('destroySession not working at the moment');
		// 		return Promise.resolve();
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
	console.log('login', url.toString());

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
	console.log('isAuth', isAuth);
};

export const getUser = async () => {
	const user = await getKindeClient().getUser();
	return user;
};

export const getToken = async () => {
	return await getKindeClient().getToken();
};
