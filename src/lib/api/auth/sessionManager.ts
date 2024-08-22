import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk';
import { CookieManager } from './cookieManager';

interface BSessionManager extends SessionManager {
	getSessionItemBrowser(key: string): Promise<string | null>;
	setSessionItemBrowser(key: string, value: unknown): Promise<void>;
	removeSessionItemBrowser(key: string): Promise<void>;
}

const keysInCookie = [
	'refresh_token',
	'access_token',
	'acwpf-state-key',
	'ac-state-key',
	'id_token',
	'user',
	'post_login_redirect_url'
];
const memCache: Record<string, string> = {};
const sessionManager: BSessionManager = {
	async getSessionItemBrowser(key: string) {
		console.log('getSessionItemBrowser', key);

		return CookieManager.getCookie(key) || memCache[key];
	},
	async getSessionItem(key: string) {
		return this.getSessionItemBrowser(key);
	},
	async setSessionItemBrowser(key: string, value: unknown) {
		const inCookieList = keysInCookie.find((k) => key.includes(k));
		console.log('setSessionItemBrowser', key, value, inCookieList);

		if (inCookieList) {
			CookieManager.setCookie(key, value as string, {
				path: '/'
			});
		} else {
			memCache[key] = value as string;
		}
	},
	async setSessionItem(key: string, value: unknown) {
		await this.setSessionItemBrowser(key, value);
	},
	async removeSessionItemBrowser(key: string) {
		console.log('removeSessionItemBrowser', key);

		for (const key in memCache) {
			delete memCache[key];
		}
		CookieManager.deleteCookie(key, { path: '' });
	},
	async removeSessionItem(key: string) {
		await this.removeSessionItemBrowser(key);
	},
	async destroySession() {
		console.warn('destroySession');

		for (const key in memCache) {
			delete memCache[key];
		}
		for (const key of keysInCookie) {
			CookieManager.deleteCookie(key, { path: '' });
		}
	}
};

export { sessionManager };
