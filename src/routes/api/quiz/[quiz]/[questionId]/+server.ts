import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { MONGODB_CONNECTION_STRING } from '$env/static/private';
import { Question, QuestionType } from '$lib/model/question';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	await mongoose.connect(MONGODB_CONNECTION_STRING);

	const questionType = params.quiz as QuestionType;
	const questionId = params.questionId as string;

	const question = await Question.findOne({ type: questionType, number: questionId });

	return json(question);
};
