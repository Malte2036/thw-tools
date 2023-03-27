import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { questionTypeToQuestionSet, type QuestionType } from '$lib/quiz/question/Question';

export type AnswerdCountData = {
	right: number;
	wrong: number;
};

export const ssr = false;
export const prerender = 'auto';

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	let questionSet = questionTypeToQuestionSet(questionType);

	depends('app:quiz');

	const isRandom = params.questionId === undefined;
	const questionNumber: number | undefined = isRandom
		? Math.floor(Math.random() * questionSet.length)
		: Number.parseInt(params.questionId!) - 1;

	let question = questionSet[questionNumber];

	if (question === undefined) {
		throw error(404, {
			message: `Id "${questionNumber}" for quiz type "${questionType}" not found!`
		});
	}

	question = {
		...question,
		answers: question.answers.map((question) => ({ ...question, checked: false }))
	};

	const nextQuestionId = isRandom ? undefined : ((questionNumber + 1) % questionSet.length) + 1;

	return {
		question,
		questionType,
		questionCount: questionSet.length,
		nextQuestionId
	};
}) satisfies PageLoad;
