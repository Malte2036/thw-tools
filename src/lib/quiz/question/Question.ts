import { error } from '@sveltejs/kit';
import { AGTQuestions } from './AGTQuestions';
import { CBRNQuestions } from './CBRNQuestions';

export type QuestionType = 'agt' | 'cbrn';

export type Question = {
	number: number;
	text: string;
	image?: string;
	answers: Answer[];
};

export type Answer = {
	text: string;
	correct: boolean;
	checked?: boolean;
};

export function questionTypeToQuestionSet(questionType: QuestionType): Question[] {
	switch (questionType) {
		case 'agt':
			return AGTQuestions;
		case 'cbrn':
			return CBRNQuestions;
		default:
			throw error(404, `QuestionType ${questionType} not found`);
	}
}
