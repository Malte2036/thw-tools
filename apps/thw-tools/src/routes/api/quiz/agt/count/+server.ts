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
		const client = new sdk.Client();
		const databases = new sdk.Databases(client);

		client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

		// inefficient and limited to 5000 docs
		const docs = await databases.listDocuments(APPWRITE_DATABASEID_QUIZ, APPWRITE_COLLECTIONID_AGT);

		return new Response(String(docs.total), {
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
