import { databases, graphql } from '$lib/database/appwrite';

import {
	PUBLIC_APPWRITE_DATABASEID_QUIZ,
	PUBLIC_APPWRITE_COLLECTIONID_GAQUESTIONS,
	PUBLIC_APPWRITE_COLLECTIONID_AGTQUESTIONS,
	PUBLIC_APPWRITE_COLLECTIONID_CBRNQUESTIONS
} from '$env/static/public';
import type { Question, QuestionType } from '$lib/quiz/question/Question';
import { Query, type Models } from 'appwrite';

export type DatabaseQuestion = Models.Document &
	Question & {
		answers: string[];
	};

export function getQuestionCollectionId(questionType: QuestionType) {
	switch (questionType) {
		case 'ga':
			return PUBLIC_APPWRITE_COLLECTIONID_GAQUESTIONS;
		case 'agt':
			return PUBLIC_APPWRITE_COLLECTIONID_AGTQUESTIONS;
		case 'cbrn':
			return PUBLIC_APPWRITE_COLLECTIONID_CBRNQUESTIONS;

		default:
			throw new Error(`No Collection for type ${questionType}`);
	}
}

export async function getDatabaseQuestionByNumber(
	questionType: QuestionType,
	questionNumber: number
): Promise<DatabaseQuestion> {
	const collectionId = getQuestionCollectionId(questionType);

	const res = await databases.listDocuments<DatabaseQuestion>(
		PUBLIC_APPWRITE_DATABASEID_QUIZ,
		collectionId,
		[Query.equal('number', questionNumber)]
	);

	if (res.documents.length === 0) {
		throw new Error(`No document found for type ${questionType} and number ${questionNumber}`);
	}

	return res.documents[0];
}

export async function getQuestionCount(questionType: QuestionType): Promise<number> {
	const collectionId = getQuestionCollectionId(questionType);

	type ResultData = { data: { databasesListDocuments: { total: number } } };

	const res: ResultData = (await graphql.query({
		query: `query GetDocumentCount($databaseId: String!, $collectionId: String!) {
			  databasesListDocuments(databaseId: $databaseId, collectionId: $collectionId) {
				total
			  }
			}`,
		variables: {
			databaseId: PUBLIC_APPWRITE_DATABASEID_QUIZ,
			collectionId
		}
	})) as ResultData;

	return res.data.databasesListDocuments.total;
}

export async function getAllDatabaseQuestions(
	questionType: QuestionType
): Promise<DatabaseQuestion[]> {
	const collectionId = getQuestionCollectionId(questionType);

	const res = await databases.listDocuments<DatabaseQuestion>(
		PUBLIC_APPWRITE_DATABASEID_QUIZ,
		collectionId,
		[Query.limit(500)]
	);

	return res.documents;
}
