import type { RequestEvent, RequestHandler } from './$types';
import sdk from 'node-appwrite';

import {
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID,
	APPWRITE_APIKEY,
	APPWRITE_DATABASEID_QUIZ,
	APPWRITE_COLLECTIONID_AGT
} from '$env/static/private';
import { json } from '@sveltejs/kit';

export type StatisticsData = { questionId: string; correct: boolean };

export const GET: RequestHandler = async ({}: RequestEvent) => {
	try {
		const client = new sdk.Client();

		client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

		const graphql = new sdk.Graphql(client);

		type ResultData = { data: { databasesListDocuments: { total: number } } };

		async function fetchCount(correct: boolean): Promise<number> {
			// limited to 5000 docs
			let res: ResultData = await graphql.query({
				query: `query {
				databasesListDocuments(
					databaseId: "${APPWRITE_DATABASEID_QUIZ}",
					collectionId: "${APPWRITE_COLLECTIONID_AGT}",
					queries: ["equal(\\"correct\\", [${correct}])"]
				) {
					total
				}
			}`
			});

			return res.data.databasesListDocuments.total;
		}

		return json(
			{
				right: await fetchCount(true),
				wrong: await fetchCount(false)
			},
			{
				headers: {
					'Cache-Control': 'no-cache'
				}
			}
		);
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
