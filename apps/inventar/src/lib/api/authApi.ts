import { browser } from '$app/environment';
import { PUBLIC_KINDE_API_CLIENT, PUBLIC_KINDE_DOMAIN } from '$env/static/public';
import { createKindeBrowserClient } from '@kinde-oss/kinde-typescript-sdk';
import { goto } from '$app/navigation';
import { sessionManager } from './auth/sessionManager';

type KindeClientType = ReturnType<typeof createKindeBrowserClient>;

let _kindeClient: KindeClientType | null = null;

export const getKindeClient = (): KindeClientType => {
	if (_kindeClient) {
		return _kindeClient;
	}

	_kindeClient = createKindeBrowserClient({
		authDomain: PUBLIC_KINDE_DOMAIN,
		clientId: PUBLIC_KINDE_API_CLIENT,
		logoutRedirectURL: window.location.origin,
		redirectURL: window.location.origin + '/auth/callback',
		sessionManager: sessionManager
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

const saveLastPath = (url: URL) => {
	if (!browser) {
		console.warn('saveLastPath: not in browser');
		return;
	}

	const path = url.pathname + url.search;
	if (path.startsWith('/auth')) {
		clearLastPath();
		return;
	}

	localStorage.setItem(LOCAL_STORAGE_LAST_PATH, path);
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

export const redirectToLastPathBeforeAuth = () => {
	const lastPath = getLastPath() ?? '/';
	clearLastPath();
	goto(lastPath);
};

export const login = async (currentUrl: URL) => {
	if (!browser) {
		console.warn('login: not in browser');
		return;
	}

	saveLastPath(currentUrl);

	const url = await getKindeClient().login();
	// use window.location.href instead of goto because of the redirect to an external domain
	window.location.href = url.toString();
};

export const handleRedirectToApp = async () => {
	if (!browser) {
		console.warn('handleRedirectToApp: not in browser');
		return;
	}

	const url = new URL(window.location.toString());
	await getKindeClient().handleRedirectToApp(url);

	redirectToLastPathBeforeAuth();
};

export const getUser = async () => {
	const user = await getKindeClient().getUser();

	return user;
};

export const isAuthenticated = async () => {
	return await getKindeClient().isAuthenticated();
};

export const getToken = async () => {
	return await getKindeClient().getToken();
};

export const getIdToken = async (): Promise<string> => {
	return (await sessionManager.getSessionItem('id_token')) as string;
};
