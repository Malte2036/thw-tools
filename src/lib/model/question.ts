import { Schema, model } from 'mongoose';

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
	answers: Map<string, string>;
	correctIndices: string[];
};

export type ExtendedQuestion = IQuestion & {
	checkedIndices: string[];
};

const questionSchema = new Schema<IQuestion>({
	type: {
		type: String,
		validate: {
			validator: function (v: any) {
				return Object.values(QuestionType).includes(v);
			},
			message: (props: { value: any }) => `${props.value} is not a valid QuestionType.`
		}
	},
	number: Number,
	text: String,
	image: String,
	answers: { type: Map, of: String },
	correctIndices: [String]
});

export const Question = model<IQuestion>('Question', questionSchema);
