import type { QuestionType } from '$lib/quiz/question/Question';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber: number = 1;

	const url = `/quiz/${questionType}/${questionNumber}/`;

	throw redirect(307, url);
}) satisfies PageLoad;
