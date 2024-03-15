import type { DatabaseQuestion } from '$lib/Database';

export type QuestionType = 'ga' | 'agt' | 'cbrn';

export type Question = {
	number: number;
	text: string;
	image?: string;
	correctIndizies: number[];
};
export type ExtendedQuestion = Question & {
	answers: Map<number, string>;
	checkedIndizies: number[];
};

export function databaseQuestionToExtendedQuestion(databaseQuestion: DatabaseQuestion) {
	return {
		...databaseQuestion,
		answers: databaseQuestion.answers.reduce(
			(map: Map<number, string>, answer: string, index: number) => {
				map.set(index, answer);
				return map;
			},
			new Map<number, string>()
		),
		checkedIndizies: []
	};
}
