import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { questionTypeToQuestionSet, type QuestionType } from '$lib/quiz/question/Question';

export type AnswerdCountData = {
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	let questionSet = questionTypeToQuestionSet(questionType);

	depends('app:quiz');

	const questionNumber: number | undefined = Number.parseInt(params.questionId!) - 1;

	let question = questionSet[questionNumber];

	if (question === undefined) {
		throw error(404, {
			message: `Id "${params.questionId}" for quiz type "${questionType}" not found!`
		});
	}

	question = {
		...question,
		answers: question.answers.map((question) => ({ ...question, checked: false }))
	};

	const nextQuestionId = ((questionNumber + 1) % questionSet.length) + 1;

	return {
		question,
		questionType,
		questionCount: questionSet.length,
		nextQuestionId
	};
}) satisfies PageServerLoad;
