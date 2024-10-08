import { QuestionType } from './question';

export type IQuestionStats = {
	questionType: QuestionType;
	questionNumber: number;
	correct: boolean;
	timestamp: Date;
};
