import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { AGTQuestions } from './AGTQuestions';
import type { Question, QuestionType } from './Question';

export const ssr = false;

export type AnswerdCountData = {
	all: number;
	correct: number;
};

export const load = (async ({ params, depends, fetch }) => {
	const questionType: QuestionType | undefined = params.type;

	let questionSet: Question[] | undefined = undefined;
	switch (questionType) {
		case 'agt':
			questionSet = AGTQuestions;
			break;
		default:
			throw error(404, `QuestionType ${questionType} not found`);
	}

	depends('app:quiz');

	const questionNumber = Math.floor(Math.random() * questionSet.length);
	let question = questionSet[questionNumber];
	question = {
		...question,
		answers: question.answers.map((question) => ({ ...question, checked: false }))
	};

	let answerdCountData: AnswerdCountData | undefined;
	try {
		answerdCountData = await (await fetch('/api/quiz/agt/count')).json();
	} catch (error) {}

	return {
		question,
		questionType,
		questionCount: questionSet.length,
		answerdCountData
	};
}) satisfies PageLoad;
