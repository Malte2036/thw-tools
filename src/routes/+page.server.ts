import { questionTypeToQuestionSet, type QuestionType } from '$lib/quiz/question/Question';
import type { PageServerLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const load = (async ({}) => {
	const questionTypes: QuestionType[] = ['agt', 'cbrn'];

	return {
		questionTypeLength: new Map(questionTypes.map((t) => [t, questionTypeToQuestionSet(t).length]))
	};
}) satisfies PageServerLoad;
