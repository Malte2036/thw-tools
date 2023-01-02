import type { QuestionType } from 'src/routes/(main)/quiz/[type]/Question';
import { APPWRITE_COLLECTIONID_AGT } from '$env/static/private';

export function getCollectionIdByQuiz(quiz: QuestionType): string {
	switch (quiz) {
		case 'agt':
			return APPWRITE_COLLECTIONID_AGT;

		default:
			throw new Error(`Quiz type "${quiz}" does not exists!`);
	}
}
