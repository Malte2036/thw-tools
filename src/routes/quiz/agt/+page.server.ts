import type { PageServerLoad } from './$types';
import { AGTQuestions } from './AGTQuestions';

export const load = (({ depends }) => {
	depends('app:quiz:agt');

	let questionNumber = Math.floor(Math.random() * AGTQuestions.length);
	let question = AGTQuestions[questionNumber];
	question = {
		...question,
		answers: question.answers.map((question) => ({ ...question, checked: false }))
	};

	return {
		question
	};
}) satisfies PageServerLoad;
