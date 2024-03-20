import { connectToDatabase } from '$lib/Database';
import { Question, QuestionType } from '$lib/model/question';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	const t = params.quiz as QuestionType;
	const allQuestions = []; //await getAllDatabaseQuestions(t);

	await connectToDatabase();

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
