import { MONGODB_CONNECTION_STRING } from '$env/static/private';
import mongoose from 'mongoose';

export async function connectToDatabase() {
	await mongoose.connect(MONGODB_CONNECTION_STRING);
}

/*export type DatabaseQuestion = sdk.Models.Document &
	Question & {
		answers: string[];
	};

function getQuestionCollectionId(questionType: QuestionType) {
	switch (questionType) {
		case 'ga':
			return APPWRITE_COLLECTIONID_GAQUESTIONS;
		case 'agt':
			return APPWRITE_COLLECTIONID_AGTQUESTIONS;
		case 'cbrn':
			return APPWRITE_COLLECTIONID_CBRNQUESTIONS;

		default:
			throw new Error(`No Collection for type ${questionType}`);
	}
}

export function getCollectionIdByQuiz(quiz: QuestionType): string {
	switch (quiz) {
		case 'ga':
			return APPWRITE_COLLECTIONID_GA;
		case 'agt':
			return APPWRITE_COLLECTIONID_AGT;
		case 'cbrn':
			return APPWRITE_COLLECTIONID_CBRN;

		default:
			throw new Error(`Quiz type "${quiz}" does not exists!`);
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
		[sdk.Query.limit(500)]
	);

	return res.documents;
}

export async function getQuestionCount(questionType: QuestionType): Promise<number> {
	const collectionId = getQuestionCollectionId(questionType);

	const client = getClient();
	const graphql = new sdk.Graphql(client);

	type ResultData = { data: { databasesListDocuments: { total: number } } };

	const res: ResultData = await graphql.query({
		query: `query GetDocumentCount($databaseId: String!, $collectionId: String!) {
			  databasesListDocuments(databaseId: $databaseId, collectionId: $collectionId) {
				total
			  }
			}`,
		variables: {
			databaseId: APPWRITE_DATABASEID_QUIZ,
			collectionId
		}
	});

	return res.data.databasesListDocuments.total;
}

export async function getCorrectCount(
	quiz: QuestionType,
	correct: boolean,
	questionNumber?: number,
	after?: Date
): Promise<number> {
	const collectionId = getCollectionIdByQuiz(quiz);

	const client = new sdk.Client();

	client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

	const graphql = new sdk.Graphql(client);

	type ResultData = { data: { databasesListDocuments: { total: number } } };

	const queries = [sdk.Query.equal('correct', correct)];

	if (questionNumber) {
		queries.push(sdk.Query.equal('questionId', questionNumber));
	}

	if (after) {
		queries.push(sdk.Query.greaterThan('createdAt', after.toISOString()));
	}

	// limited to 5000 docs
	const res: ResultData = await graphql.query({
		query: `query GetDocumentCount($databaseId: String!, $collectionId: String!, $queries: [String!]!) {
			databasesListDocuments(databaseId: $databaseId, collectionId: $collectionId, queries: $queries) {
			  total
			}
		  }`,
		variables: {
			databaseId: APPWRITE_DATABASEID_QUIZ,
			collectionId,
			queries
		}
	});

	return res.data.databasesListDocuments.total;
}

export type StatisticsData = { questionId: string; correct: boolean };

export async function addCount(quiz: QuestionType, data: StatisticsData) {
	const collectionId = getCollectionIdByQuiz(quiz);

	const client = new sdk.Client();

	client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

	const databases = new sdk.Databases(client);

	await databases.createDocument(APPWRITE_DATABASEID_QUIZ, collectionId, 'unique()', data);
}

*/
