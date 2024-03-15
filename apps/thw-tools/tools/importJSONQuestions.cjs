const sdk = require('node-appwrite');
const dotenv = require('dotenv');
const newQuestions = require('./newQuestions.json');

// Load environment variables from .env file
dotenv.config();

const APPWRITE_APIKEY = process.env.APPWRITE_APIKEY;
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECTID = process.env.APPWRITE_PROJECTID;

const APPWRITE_DATABASEID_QUIZ = process.env.APPWRITE_DATABASEID_QUIZ;

const APPWRITE_COLLECTIONID_GAQUESTIONS = process.env.APPWRITE_COLLECTIONID_GAQUESTIONS;
const APPWRITE_COLLECTIONID_AGTQUESTIONS = process.env.APPWRITE_COLLECTIONID_AGTQUESTIONS;
const APPWRITE_COLLECTIONID_CBRNQUESTIONS = process.env.APPWRITE_COLLECTIONID_CBRNQUESTIONS;

const client = new sdk.Client();

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECTID).setKey(APPWRITE_APIKEY);

const collectionId = ''; // Set the collectionId to 'APPWRITE_COLLECTIONID_AGTQUESTIONS' or 'APPWRITE_COLLECTIONID_CBRNQUESTIONS' depending on the quiz you want to import

const databaseId = APPWRITE_DATABASEID_QUIZ;
const databases = new sdk.Databases(client);

async function saveQuestions() {
	const questions = newQuestions.map((q) => ({
		...q,
		image: undefined
	}));
	console.log(questions);
	try {
		const promises = questions.map((question) =>
			databases.createDocument(databaseId, collectionId, 'unique()', {
				...question
			})
		);

		const results = await Promise.all(promises);
		console.log('Questions saved:', results);
	} catch (error) {
		console.error('Error:', error);
	}
}

async function main() {
	saveQuestions();
}

main().catch((error) => {
	console.error('An error occurred:', error);
});
