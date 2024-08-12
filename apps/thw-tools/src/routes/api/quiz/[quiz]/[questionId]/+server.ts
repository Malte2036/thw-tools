import { getQuestion } from '$lib/api/api';
import type { QuestionType } from '$lib/model/question';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const questionType = params.quiz as QuestionType;
	const questionId = params.questionId as string;

	const question = await getQuestion(questionType, Number(questionId));

	return json(question);
};
