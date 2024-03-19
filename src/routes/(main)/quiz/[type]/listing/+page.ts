import type { QuestionType } from '$lib/quiz/question/Question';
import { getAllDatabaseQuestions } from '$lib/database/questions';
import type { PageLoad } from '../$types';

export const ssr = false;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const allQuestions = await getAllDatabaseQuestions(questionType);
	return {
		questionType,
		allQuestions
	};
}) satisfies PageLoad;
