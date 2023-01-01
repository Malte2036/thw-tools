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

		client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

		const graphql = new sdk.Graphql(client);

		type ResultData = { data: { databasesListDocuments: { total: number } } };

		// limited to 5000 docs
		const res = await graphql.query({
			query: `query {
				databasesListDocuments(
					databaseId: "${APPWRITE_DATABASEID_QUIZ}",
					collectionId: "${APPWRITE_COLLECTIONID_AGT}"
				) {
					total
				}
			}`
		});

		const resData = res as ResultData;

		return new Response(String(resData.data.databasesListDocuments.total), {
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
