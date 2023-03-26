export type QuestionType = 'agt';

export type Question = {
	number: number;
	text: string;
	answers: Answer[];
};

export type Answer = {
	text: string;
	correct: boolean;
	checked?: boolean;
};
