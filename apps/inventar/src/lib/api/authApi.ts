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

const LOCAL_STORAGE_LAST_PATH = 'auth_last_path';
const LOCAL_STORAGE_ACCESS_TOKEN = 'auth_access_token';

const saveLastPath = () => {
	if (!browser) {
		console.warn('saveLastPath: not in browser');
		return;
	}

	localStorage.setItem(LOCAL_STORAGE_LAST_PATH, window.location.pathname + window.location.search);
};

const getLastPath = () => {
	if (!browser) {
		console.warn('getLastPath: not in browser');
		return;
	}

	return localStorage.getItem(LOCAL_STORAGE_LAST_PATH);
};

const clearLastPath = () => {
	if (!browser) {
		console.warn('clearLastPath: not in browser');
		return;
	}

	localStorage.removeItem(LOCAL_STORAGE_LAST_PATH);
};

export const login = async () => {
	if (!browser) {
		console.warn('login: not in browser');
		return;
	}

	saveLastPath();

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

	localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, await getKindeClient().getToken());

	const lastPath = getLastPath();
	if (lastPath) {
		console.log('redirecting to', lastPath);
		window.location.href = lastPath;
		clearLastPath();
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
	return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
};
