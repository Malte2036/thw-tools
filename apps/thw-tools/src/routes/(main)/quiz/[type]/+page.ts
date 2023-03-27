import { questionTypeToQuestionSet, type QuestionType } from '$lib/quiz/question/Question';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;
	const questionSet = questionTypeToQuestionSet(questionType);

	const questionNumber: number = Math.floor(Math.random() * questionSet.length) + 1;

	return {
		questionType,
		questionNumber
	};
}) satisfies PageLoad;
