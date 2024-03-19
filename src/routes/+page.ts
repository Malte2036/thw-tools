import { getQuestionCount } from '$lib/database/questions';
import type { QuestionType } from '$lib/quiz/question/Question';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({}) => {
	const questionTypes: QuestionType[] = ['ga', 'agt', 'cbrn'];

	const questionTypeLength = new Map();

	await Promise.all(
		questionTypes.map(async (t) => {
			const count = await getQuestionCount(t);
			questionTypeLength.set(t, count);
		})
	);

	return {
		questionTypeLength
	};
}) satisfies PageLoad;
