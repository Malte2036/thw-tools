import { findQuestions } from '$lib/Database';
import type { IQuestion, QuestionType } from '$lib/model/question';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const allQuestions: IQuestion[] = await findQuestions({ type: questionType });

	return {
		questionType,
		allQuestions
	};
}) satisfies PageServerLoad;
