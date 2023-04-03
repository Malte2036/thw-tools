import type { PageServerLoad } from './$types';
import type { QuestionType } from '$lib/quiz/question/Question';
import { getAllDatabaseQuestions } from '$lib/Database';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const allQuestions = await getAllDatabaseQuestions(questionType);
	return {
		questionType,
		allQuestions
	};
}) satisfies PageServerLoad;
