import * as sdk from 'node-appwrite';
import {
	APPWRITE_APIKEY,
	APPWRITE_ENDPOINT,
	APPWRITE_PROJECTID,
	APPWRITE_COLLECTIONID_AGTQUESTIONS,
	APPWRITE_COLLECTIONID_CBRNQUESTIONS,
	APPWRITE_DATABASEID_QUIZ
} from '$env/static/private';
import type { Question, QuestionType } from './quiz/question/Question';

export type DatabaseQuestion = sdk.Models.Document &
	Question & {
		answers: string[];
	};

function getQuestionCollectionId(questionType: QuestionType) {
	switch (questionType) {
		case 'agt':
			return APPWRITE_COLLECTIONID_AGTQUESTIONS;
		case 'cbrn':
			return APPWRITE_COLLECTIONID_CBRNQUESTIONS;

		default:
			throw new Error(`No Collection for type ${questionType}`);
	}
}

function getClient(): sdk.Client {
	const client = new sdk.Client();

	client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);
	return client;
}

export async function getDatabaseQuestionByNumber(
	questionType: QuestionType,
	questionNumber: number
): Promise<DatabaseQuestion> {
	const collectionId = getQuestionCollectionId(questionType);

	const client = getClient();
	const databases = new sdk.Databases(client);

	const res = await databases.listDocuments<DatabaseQuestion>(
		APPWRITE_DATABASEID_QUIZ,
		collectionId,
		[sdk.Query.equal('number', questionNumber)]
	);

	if (res.documents.length === 0) {
		throw new Error(`No document found for type ${questionType} and number ${questionNumber}`);
	}

	return res.documents[0];
}

export async function getAllDatabaseQuestions(
	questionType: QuestionType
): Promise<DatabaseQuestion[]> {
	const collectionId = getQuestionCollectionId(questionType);

	const client = getClient();
	const databases = new sdk.Databases(client);

	const res = await databases.listDocuments<DatabaseQuestion>(
		APPWRITE_DATABASEID_QUIZ,
		collectionId,
		[sdk.Query.limit(100)]
	);

	return res.documents;
}

export async function getQuestionCount(questionType: QuestionType): Promise<number> {
	const collectionId = getQuestionCollectionId(questionType);

	const client = getClient();
	const graphql = new sdk.Graphql(client);

	type ResultData = { data: { databasesListDocuments: { total: number } } };

	const res: ResultData = await graphql.query({
		query: `query {
		    databasesListDocuments(
			    databaseId: "${APPWRITE_DATABASEID_QUIZ}",
			    collectionId: "${collectionId}",
		    ) {
			    total
		    }
	    }`
	});

	return res.data.databasesListDocuments.total;
}
