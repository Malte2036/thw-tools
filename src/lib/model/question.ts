export enum QuestionType {
	GA = 'ga',
	AGT = 'agt',
	CBRN = 'cbrn'
}

export type IQuestion = {
	type: QuestionType;
	number: number;
	text: string;
	image: string;
	answers: Map<number, string>;
	correctIndices: number[];
};

export type ExtendedQuestion = IQuestion & {
	checkedIndices: number[];
};
