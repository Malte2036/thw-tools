import { PUBLIC_API_URL } from '$env/static/public';
import { CustomError, HttpError, UnauthorizedError } from './error';

const checkIfResposeIsUnauthorized = (res: Response) => {
	if (res.status === 403) {
		throw new UnauthorizedError();
	}
};

export async function apiGet<T>(path: string, verifyData?: (data: T) => boolean) {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			}
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

		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}

export async function apiPost<T>(path: string, body?: any, verifyData?: (data: T) => boolean) {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
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

		return data;
	} catch (error) {
		console.error('Error posting data:', error);
		throw error;
	}
}

export async function apiPostStream<T>(
	path: string,
	body?: any,
	verifyData?: (data: T) => boolean
): Promise<ReadableStream<string>> {
	const url = new URL(path, PUBLIC_API_URL);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
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

		// Return a new ReadableStream to process and stream data chunks
		return new ReadableStream({
			async start(controller) {
				const reader = response.body?.getReader();
				const decoder = new TextDecoder('utf-8');

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						// Decode the chunk and enqueue it to the stream
						const chunk = decoder.decode(value, { stream: true });
						controller.enqueue(chunk);

						// Optionally parse and verify each chunk as JSON
						// try {
						// 	const dataChunk: T = JSON.parse(chunk);
						// 	if (verifyData && !verifyData(dataChunk)) {
						// 		throw new CustomError(`Failed to verify data.`);
						// 	}
						// } catch (error) {
						// 	console.warn('Chunk could not be parsed or verified:', error);
						// }
					}
				}
				controller.close();
			},
			cancel() {
				console.log('Stream canceled');
			}
		});
	} catch (error) {
		console.error('Error posting data:', error);
		throw error;
	}
}

function readChunks(reader: any) {
	return {
		async *[Symbol.asyncIterator]() {
			let readResult = await reader.read();
			while (!readResult.done) {
				yield readResult.value;
				readResult = await reader.read();
			}
		}
	};
}

export async function apiGetFile(path: string) {
	const url = new URL(path, PUBLIC_API_URL);
	try {
		const response = await fetch(url, {
			headers: {}
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
