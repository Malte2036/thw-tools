import type { RequestEvent, RequestHandler } from './$types';
import sdk from 'node-appwrite';

import {
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID,
	APPWRITE_APIKEY,
	APPWRITE_DATABASEID_QUIZ
} from '$env/static/private';
import type { QuestionType } from 'src/routes/(main)/quiz/[type]/Question';
import { getCollectionIdByQuiz } from '../utils';

export type StatisticsData = { questionId: string; correct: boolean };

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
	const body: StatisticsData = await request.json();

	try {
		const quiz = params.quiz as QuestionType;
		const collectionId = getCollectionIdByQuiz(quiz);

		const client = new sdk.Client();
		const databases = new sdk.Databases(client);

		client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

		await databases.createDocument(APPWRITE_DATABASEID_QUIZ, collectionId, 'unique()', body);
	} catch (error) {
		console.warn(`Could not write agt quiz statistics to appwrite`, error);
	}

	return new Response(null, { status: 200 });
};
