import { getQuestion, getQuestionCount } from '$lib/api/api';
import type { QuestionType } from '$lib/model/question';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export type AnsweredCountData = {
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber = Number.parseInt(params.questionId!);

	const question = await getQuestion(questionType, questionNumber);

	if (!question) {
		error(404, 'Question not found');
	}

	const questionCount = await getQuestionCount(questionType);

	const nextQuestionId = (questionNumber % questionCount) + 1;

	return {
		question,
		questionType,
		questionCount,
		nextQuestionId
	};
}) satisfies PageServerLoad;
