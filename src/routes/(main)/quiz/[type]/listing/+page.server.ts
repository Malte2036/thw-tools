import { getQuestions } from '$lib/api/api';
import type { Question, QuestionType } from '$lib/model/question';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const allQuestions: Question[] = await getQuestions(questionType);

	return {
		questionType,
		allQuestions
	};
}) satisfies PageServerLoad;
