import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { QuestionType } from '$lib/model/question';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber: number = 1;

	const url = `/quiz/${questionType}/${questionNumber}/`;

	throw redirect(307, url);
}) satisfies PageServerLoad;
