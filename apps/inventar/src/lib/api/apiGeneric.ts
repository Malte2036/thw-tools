import { PUBLIC_API_URL } from '$env/static/public';
import { destroySession, getIdToken, getToken } from './authApi';
import { CustomError, HttpError, UnauthorizedError } from './error';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 401) {
		console.log('Unauthorized. Destroying session...');
		destroySession().then(() => {
			window.location.reload();
		});

		throw new UnauthorizedError();
	}
	if (res.status === 403) {
		throw new UnauthorizedError();
	}
};

export type ResponeData<T> = {
	data: T;
	fromCache: boolean;
};

function responseToData<T>(response: Response, data: T): ResponeData<T> {
	return {
		data,
		fromCache: response.headers.get('x-served-from') === 'cache'
	};
}

async function createHeaders(includeContentType = true): Promise<Headers> {
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${await getToken()}`);

	if (includeContentType) {
		headers.append('Content-Type', 'application/json');
	}

	headers.append('x-id-token', await getIdToken());

	return headers;
}

export async function apiGet<T>(
	path: string,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			headers: await createHeaders()
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to fetch data from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}

		return responseToData(response, data);
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export async function apiPost<T>(
	path: string,
	body?: any,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: await createHeaders(),
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to post data from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}

		return responseToData(response, data);
	} catch (error) {
		console.error('Error posting data:', error);
		throw error;
	}
}

export async function apiPostFile<T>(
	path: string,
	file: File,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const formData = new FormData();
		formData.append('file', file, file.name);

		const response = await fetch(url, {
			method: 'POST',
			headers: await createHeaders(false),
			body: formData
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to post file to ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}
		return responseToData(response, data);
	} catch (error) {
		console.error('Error posting file:', error);
		throw error;
	}
}

export async function apiPatch<T>(
	path: string,
	body?: any,
	verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: await createHeaders(),
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to patch data to ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		const data: T = await response.json();
		if (verifyData && !verifyData(data)) {
			throw new CustomError(`Failed to verify data.`);
		}

		return responseToData(response, data);
	} catch (error) {
		console.error('Error patching data:', error);
		throw error;
	}
}

export async function apiGetFile(path: string) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			headers: await createHeaders()
		});

		if (!response.ok) {
			checkIfResposeIsUnauthorized(response);

			const errorData = await response.json();

			throw new HttpError(
				response.status,
				`Failed to get file from ${url}: ${errorData.message}`,
				errorData.message ?? response.statusText
			);
		}

		return response.blob();
	} catch (error) {
		console.error('Error fetching file:', error);
		throw error;
	}
}
