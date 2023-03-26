import type { RequestEvent, RequestHandler } from './$types';
import sdk from 'node-appwrite';

import {
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID,
	APPWRITE_APIKEY,
	APPWRITE_DATABASEID_QUIZ
} from '$env/static/private';
import { json } from '@sveltejs/kit';
import { getCollectionIdByQuiz } from '../utils';
import type { QuestionType } from '$lib/quiz/question/Question';

export type StatisticsData = { questionId: string; correct: boolean };
type ResultData = { data: { databasesListDocuments: { total: number } } };

async function fetchCount(quiz: QuestionType, correct: boolean): Promise<number> {
	const collectionId = getCollectionIdByQuiz(quiz);

	const client = new sdk.Client();

	client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

	const graphql = new sdk.Graphql(client);

	// limited to 5000 docs
	const res: ResultData = await graphql.query({
		query: `query {
			databasesListDocuments(
				databaseId: "${APPWRITE_DATABASEID_QUIZ}",
				collectionId: "${collectionId}",
				queries: ["equal(\\"correct\\", [${correct}])"]
			) {
				total
			}
		}`
	});

	return res.data.databasesListDocuments.total;
}

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;

		return json(
			{
				right: await fetchCount(quiz, true),
				wrong: await fetchCount(quiz, false)
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
