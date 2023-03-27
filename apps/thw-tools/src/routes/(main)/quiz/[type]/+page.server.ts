import type { QuestionType } from '$lib/quiz/question/Question';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;
	//const questionSet = questionTypeToQuestionSet(questionType);

	const questionNumber: number = 1; /*Math.floor(Math.random() * questionSet.length) + 1;*/

	const url = `/quiz/${questionType}/${questionNumber}`;

	throw redirect(300, url);
}) satisfies PageServerLoad;
