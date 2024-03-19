import { databases, graphql } from '$lib/database/appwrite';

import {
	PUBLIC_APPWRITE_COLLECTIONID_AGT,
	PUBLIC_APPWRITE_COLLECTIONID_CBRN,
	PUBLIC_APPWRITE_COLLECTIONID_GA,
	PUBLIC_APPWRITE_DATABASEID_QUIZ
} from '$env/static/public';
import type { QuestionType } from '$lib/quiz/question/Question';
import { Query } from 'appwrite';

export function getCollectionIdByQuiz(quiz: QuestionType): string {
	switch (quiz) {
		case 'ga':
			return PUBLIC_APPWRITE_COLLECTIONID_GA;
		case 'agt':
			return PUBLIC_APPWRITE_COLLECTIONID_AGT;
		case 'cbrn':
			return PUBLIC_APPWRITE_COLLECTIONID_CBRN;

		default:
			throw new Error(`Quiz type "${quiz}" does not exists!`);
	}
}

export async function getCorrectCount(
	quiz: QuestionType,
	correct: boolean,
	questionNumber?: number,
	after?: Date
): Promise<number> {
	const collectionId = getCollectionIdByQuiz(quiz);

	type ResultData = { data: { databasesListDocuments: { total: number } } };

	const queries = [Query.equal('correct', correct)];

	if (questionNumber) {
		queries.push(Query.equal('questionId', questionNumber));
	}

	if (after) {
		queries.push(Query.greaterThan('createdAt', after.toISOString()));
	}

	// limited to 5000 docs
	const res: ResultData = (await graphql.query({
		query: `query GetDocumentCount($databaseId: String!, $collectionId: String!, $queries: [String!]!) {
			databasesListDocuments(databaseId: $databaseId, collectionId: $collectionId, queries: $queries) {
			  total
			}
		  }`,
		variables: {
			databaseId: PUBLIC_APPWRITE_DATABASEID_QUIZ,
			collectionId,
			queries
		}
	})) as ResultData;

	return res.data.databasesListDocuments.total;
}

export async function getCorrectAndWrongCount(quiz: QuestionType, questionNumber: number) {
	const right = await getCorrectCount(quiz, true, questionNumber);
	const wrong = await getCorrectCount(quiz, false, questionNumber);

	return { right, wrong };
}

export async function getCorrectCountByType(quiz: QuestionType) {
	/*const questionCount = await getQuestionCount(quiz);
	const allQuestionNumbers = Array.from({ length: questionCount }, (_, i) => i + 1);

	// get correct count for every question
	const right = sumArray(
		await Promise.all(allQuestionNumbers.map((n) => getCorrectCount(quiz, true, n)))
	);
	const wrong = sumArray(
		await Promise.all(allQuestionNumbers.map((n) => getCorrectCount(quiz, false, n)))
	);

	return { right, wrong };*/
	return {
		right: 0,
		wrong: 0
	};
}

export type StatisticsData = { questionId: number; correct: boolean };

export async function addCount(quiz: QuestionType, data: StatisticsData) {
	const collectionId = getCollectionIdByQuiz(quiz);

	await databases.createDocument(PUBLIC_APPWRITE_DATABASEID_QUIZ, collectionId, 'unique()', data);
}
