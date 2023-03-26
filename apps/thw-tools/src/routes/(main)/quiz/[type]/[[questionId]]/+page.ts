import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { AGTQuestions } from '$lib/quiz/question/AGTQuestions';
import { CBRNQuestions } from '$lib/quiz/question/CBRNQuestions';
import type { Question, QuestionType } from '$lib/quiz/question/Question';

export type AnswerdCountData = {
	right: number;
	wrong: number;
};

export const ssr = false;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	let questionSet: Question[] | undefined = undefined;
	switch (questionType) {
		case 'agt':
			questionSet = AGTQuestions;
			break;
		case 'cbrn':
			questionSet = CBRNQuestions;
			break;
		default:
			throw error(404, `QuestionType ${questionType} not found`);
	}

	depends('app:quiz');

	const questionNumber: number | undefined = params.questionId
		? Number.parseInt(params.questionId) - 1
		: Math.floor(Math.random() * questionSet.length);
	let question = questionSet[questionNumber];
	question = {
		...question,
		answers: question.answers.map((question) => ({ ...question, checked: false }))
	};

	return {
		question,
		questionType,
		questionCount: questionSet.length
	};
}) satisfies PageLoad;
