export type QuestionType = 'agt';

export type Question = {
	number: number;
	text: string;
	answers: Answer[];
};

export type Answer = {
	letter: string;
	text: string;
	correct: boolean;
	checked?: boolean;
};
