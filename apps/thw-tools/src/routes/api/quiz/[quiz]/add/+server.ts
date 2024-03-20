import type { RequestEvent, RequestHandler } from './$types';
import type { QuestionType } from '$lib/model/question';
import { QuestionStats, type IQuestionStats } from '$lib/model/questionStats';
import { connectToDatabase } from '$lib/Database';

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
	const body: IQuestionStats = await request.json();

	const quiz = params.quiz as QuestionType;

	await connectToDatabase();

	const stats = new QuestionStats({
		questionType: quiz,
		questionNumber: body.questionNumber,
		correct: body.correct,
		timestamp: new Date()
	});

	await stats.save();

	return new Response(null, { status: 200 });
};
