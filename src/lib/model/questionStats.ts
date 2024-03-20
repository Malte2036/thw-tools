import { Schema, model } from 'mongoose';
import { QuestionType } from './question';

export type IQuestionStats = {
	questionType: QuestionType;
	questionNumber: number;
	correct: boolean;
	timestamp: Date;
};

const questionStatsSchema = new Schema({
	questionType: {
		type: String,
		validate: {
			validator: function (v: any) {
				return Object.values(QuestionType).includes(v);
			},
			message: (props: { value: any }) => `${props.value} is not a valid QuestionType.`
		}
	},
	questionNumber: { type: Number, required: true },
	correct: { type: Boolean, required: true },
	timestamp: { type: Date, required: true }
});

export const QuestionStats = model<IQuestionStats>('QuestionStats', questionStatsSchema);
