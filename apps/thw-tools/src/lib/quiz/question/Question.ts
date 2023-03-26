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
