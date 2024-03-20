import { connectToDatabase } from '$lib/Database';
import { Question, QuestionType } from '$lib/model/question';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	await connectToDatabase();

	const questionType = params.quiz as QuestionType;
	const questionId = params.questionId as string;

	const question = await Question.findOne({ type: questionType, number: questionId });

	return json(question);
};
