import type { PageLoad } from './$types';
import type { QuestionType } from '$lib/quiz/question/Question';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;
	return {
		questionType
	};
}) satisfies PageLoad;
