import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk';
import { CookieManager } from './cookieManager';
import type { CookieAttributes } from 'es-cookie';

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

const cookieOptions: CookieAttributes = {
	path: '/',
	expires: 365,
	sameSite: 'strict',
	secure: true
};

const memCache: Record<string, string> = {};
const sessionManager: BSessionManager = {
	async getSessionItemBrowser(key: string) {
		return CookieManager.getCookie(key) || memCache[key];
	},

	async getSessionItem(key: string) {
		return this.getSessionItemBrowser(key);
	},

	async setSessionItemBrowser(key: string, value: unknown) {
		const inCookieList = keysInCookie.find((k) => key.includes(k));

		if (inCookieList) {
			CookieManager.setCookie(key, value as string, cookieOptions);
		} else {
			memCache[key] = value as string;
		}
	},

	async setSessionItem(key: string, value: unknown) {
		await this.setSessionItemBrowser(key, value);
	},

	async removeSessionItemBrowser(key: string) {
		for (const key in memCache) {
			delete memCache[key];
		}
		CookieManager.deleteCookie(key, cookieOptions);
	},

	async removeSessionItem(key: string) {
		await this.removeSessionItemBrowser(key);
	},

	async destroySession() {
		for (const key in memCache) {
			delete memCache[key];
		}
		for (const key of keysInCookie) {
			CookieManager.deleteCookie(key, cookieOptions);
		}
	}
};

export { sessionManager };
