import {
	APPWRITE_APIKEY,
	APPWRITE_COLLECTIONID_AGT,
	APPWRITE_COLLECTIONID_CBRN,
	APPWRITE_COLLECTIONID_GA,
	APPWRITE_DATABASEID_QUIZ,
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID
} from '$env/static/private';
import { connectToDatabase } from '$lib/Database';
import { QuestionType } from '$lib/model/question';
import { QuestionStats } from '$lib/model/questionStats';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import appwrite, { Query } from 'node-appwrite';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const client = new appwrite.Client();
	client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);
	const database = new appwrite.Databases(client);

	const quizType = params.quiz as QuestionType;

	const collectionId = (() => {
		switch (params.quiz) {
			case 'agt':
				return APPWRITE_COLLECTIONID_AGT;
			case 'cbrn':
				return APPWRITE_COLLECTIONID_CBRN;
			case 'ga':
				return APPWRITE_COLLECTIONID_GA;
		}
	})();
	if (!collectionId) {
		return new Response("Invalid quiz type. Must be one of 'agt', 'cbrn', or 'ga'.", {
			status: 400,
			headers: {
				'Cache-Control': 'no-cache'
			}
		});
	}

	const LIMT = 5000;
	var i = 0;

	const allStats = [];
	do {
		allStats.push(
			...(
				await database.listDocuments(APPWRITE_DATABASEID_QUIZ, collectionId, [
					Query.limit(LIMT),
					Query.offset(i * LIMT)
				])
			).documents
		);
		i++;
	} while (allStats.length % LIMT === 0);

	console.log(`allStats.length: ${allStats.length}`);

	await connectToDatabase();

	await QuestionStats.bulkWrite(
		allStats.map((s) => ({
			insertOne: {
				document: {
					questionType: quizType,
					questionNumber: s['questionId'],
					correct: s['correct'],
					timestamp: new Date(s.$createdAt)
				}
			}
		}))
	);
	console.log('done, added all stats');

	return new Response(null, {
		status: 200,
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
};
