import type { RequestEvent, RequestHandler } from './$types';
import sdk from 'node-appwrite';

import {
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID,
	APPWRITE_APIKEY,
	APPWRITE_DATABASEID_QUIZ,
	APPWRITE_COLLECTIONID_AGT
} from '$env/static/private';

export type StatisticsData = { questionId: string; correct: boolean };

export const GET: RequestHandler = async ({}: RequestEvent) => {
	try {
		// node-appwrite does not support this at the moment
		const res = await fetch(
			'{endpoint}/databases/{databaseId}/collections/{collectionId}/usage'
				.replace('{endpoint}', APPWRITE_ENDPOINT)
				.replace('{databaseId}', APPWRITE_DATABASEID_QUIZ)
				.replace('{collectionId}', APPWRITE_COLLECTIONID_AGT),
			{
				method: 'GET',
				headers: {
					'X-Appwrite-Project': APPWRITE_PROJECTID,
					'Content-Type': 'application/json',
					'X-Appwrite-Key': APPWRITE_APIKEY
				}
			}
		);
		const documentsStatistics: { value: number; date: string }[] = (await res.json())
			.documentsCount;
		const documentsSum = documentsStatistics.reduce((sum, current) => sum + current.value, 0);

		return new Response(String(documentsSum), {
			status: 200,
			headers: {
				'Cache-Control': 'no-cache'
			}
		});
	} catch (error) {
		console.warn(`Could not get quiz statistics from appwrite`, error);
	}

	return new Response(null, {
		status: 500,
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
};
