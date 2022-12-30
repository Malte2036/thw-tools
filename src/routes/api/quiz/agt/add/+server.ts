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

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const body: StatisticsData = await request.json();

	try {
		const client = new sdk.Client();
		const databases = new sdk.Databases(client);

		client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

		await databases.createDocument(
			APPWRITE_DATABASEID_QUIZ,
			APPWRITE_COLLECTIONID_AGT,
			'unique()',
			body
		);
	} catch (error) {
		console.warn(`Could not write agt quiz statistics to appwrite`, error);
	}

	return new Response(null, { status: 200 });
};
