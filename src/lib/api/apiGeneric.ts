/*const res = await fetch(`${PUBLIC_API_URL}/inventar`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	});

	if (!res.ok) {
		checkIfResposeIsUnauthorized(res);
		throw new Error('Failed to fetch inventar items');
	}

	return await res.json();
    */

import { PUBLIC_API_URL } from '$env/static/public';
import { clearTokenFromLocalStorage, getToken } from './authApi';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		clearTokenFromLocalStorage();
		throw new UnauthorizedError();
	}
};

export async function apiGet<T>(path: string) {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getToken()}`
			}
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);
			throw new Error(`Failed to fetch data from ${url}`);
		}

		const data: T = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export async function apiPost<T>(path: string, body: any) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getToken()}`
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);
			throw new Error(`Failed to post data to ${url}`);
		}

		const data: T = await response.json();
		return data;
	} catch (error) {
		console.error('Error posting data:', error);
		throw error;
	}
}
