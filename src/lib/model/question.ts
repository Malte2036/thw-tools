import { z } from 'zod';

export enum QuestionType {
	GA = 'ga',
	AGT = 'agt',
	CBRN = 'cbrn',
	RADIO = 'radio'
}

const questionAnswerSchema = z.object({
	id: z.number(),
	text: z.string(),
	isCorrect: z.boolean()
});

export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;

export const questionSchema = z.object({
	id: z.number(),
	type: z.nativeEnum(QuestionType),
	number: z.number(),
	text: z.string(),
	image: z.string().optional().nullable(),
	answers: z.array(questionAnswerSchema)
});

export type Question = z.infer<typeof questionSchema>;

export type ExtendedQuestion = Question & {
	checkedAnswers: number[];
};

export const questionsStatsCountSchema = z.object({
	right: z.number(),
	wrong: z.number()
});

export type QuestionsStatsCount = z.infer<typeof questionsStatsCountSchema>;
