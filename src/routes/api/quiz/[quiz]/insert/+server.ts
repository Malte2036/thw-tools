import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { MONGODB_CONNECTION_STRING } from '$env/static/private';
import { Question, QuestionType } from '$lib/model/question';
import { getAllDatabaseQuestions } from '$lib/Database';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const t = params.quiz as QuestionType;
	const allQuestions = await getAllDatabaseQuestions(t);

	await mongoose.connect(MONGODB_CONNECTION_STRING);

	await Promise.all(
		allQuestions.map(async (question) => {
			const answerMap = new Map<string, string>();
			question.answers.forEach((answer, index) => answerMap.set(index.toString(), answer));

			const res = await new Question({
				type: t,
				number: question.number,
				text: question.text,
				answers: answerMap,
				correctIndices: question.correctIndizies,
				image: question.image
			}).save();
			console.log('saved question', res._id);
		})
	);

	console.log('SAVED ALL ' + t + ' QUESTIONS');

	return new Response(null, {
		status: 200,
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
};
