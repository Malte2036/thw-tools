import { getQuestionCount } from '$lib/Database';
import type { QuestionType } from '$lib/quiz/question/Question';
import type { PageServerLoad } from './$types';

export const prerender = true;

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
}) satisfies PageServerLoad;
