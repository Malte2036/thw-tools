import { error } from '@sveltejs/kit';
import { AGTQuestions } from './AGTQuestions';
import { CBRNQuestions } from './CBRNQuestions';

export type QuestionType = 'agt' | 'cbrn';

export type Question = {
	number: number;
	text: string;
	image?: string;
	correctIndizies: number[];
};

export type JSONQuestion = Question & {
	answers: string[];
};

export type ExtendedQuestion = Question & {
	answers: Map<number, string>;
	checkedIndizies: number[];
};

export function questionTypeToQuestionSet(questionType: QuestionType): ExtendedQuestion[] {
	var set: JSONQuestion[] = [];
	switch (questionType) {
		case 'agt':
			set = AGTQuestions;
			break;
		case 'cbrn':
			set = CBRNQuestions;
			break;
		default:
			throw error(404, `QuestionType ${questionType} not found`);
	}
	return set.map((q: JSONQuestion) => ({
		...q,
		answers: q.answers.reduce((map: Map<number, string>, answer: string, index: number) => {
			map.set(index, answer);
			return map;
		}, new Map<number, string>()),
		checkedIndizies: []
	}));
}
