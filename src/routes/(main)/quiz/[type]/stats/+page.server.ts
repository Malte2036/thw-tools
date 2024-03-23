import { countQuestionStats, findQuestions } from '$lib/Database';
import type { IQuestion, QuestionType } from '$lib/model/question';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const now = new Date();
	const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const statsToday = await countQuestionStats({ questionType }, todayMorning);

	console.log('statsToday: ', statsToday);

	return {
		questionType,
		statsToday
	};
}) satisfies PageServerLoad;
