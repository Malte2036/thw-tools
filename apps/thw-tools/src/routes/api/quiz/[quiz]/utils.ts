import type { QuestionType } from '$lib/quiz/question/Question';
import { APPWRITE_COLLECTIONID_AGT, APPWRITE_COLLECTIONID_CBRN } from '$env/static/private';

export function getCollectionIdByQuiz(quiz: QuestionType): string {
	switch (quiz) {
		case 'agt':
			return APPWRITE_COLLECTIONID_AGT;
		case 'cbrn':
			return APPWRITE_COLLECTIONID_CBRN;

		default:
			throw new Error(`Quiz type "${quiz}" does not exists!`);
	}
}
