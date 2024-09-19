import { PUBLIC_API_URL } from '$env/static/public';
import { getToken } from './authApi';
import { UnauthorizedError } from './error';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		throw new UnauthorizedError();
	}
};

export async function apiGet<T>(path: string) {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await getToken()}`
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

export async function apiPost<T>(path: string, body?: any) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${await getToken()}`
			},
			body: body ? JSON.stringify(body) : undefined
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

export async function apiGetFile(path: string) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${await getToken()}`
			}
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);
			throw new Error(`Failed to fetch file from ${url}`);
		}

		return response.blob();
	} catch (error) {
		console.error('Error fetching file:', error);
		throw error;
	}
}
