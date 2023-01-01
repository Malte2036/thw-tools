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

		// limited to 5000 docs
		const allRes = await graphql.query({
			query: `query {
				databasesListDocuments(
					databaseId: "${APPWRITE_DATABASEID_QUIZ}",
					collectionId: "${APPWRITE_COLLECTIONID_AGT}"
				) {
					total
				}
			}`
		});

		const allResData = allRes as ResultData;

		const correctRes = await graphql.query({
			query: `query {
				databasesListDocuments(
					databaseId: "63af16f75da2583a0544",
					collectionId: "63af16fd67f0cae4f87b",
					queries: ["equal(\\"correct\\", [true])"]
				) {
					total
				}
			}`
		});

		const correctResData = correctRes as ResultData;

		return json(
			{
				all: allResData.data.databasesListDocuments.total,
				correct: correctResData.data.databasesListDocuments.total
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
