import { insertQuestionStats } from '$lib/Database';
import type { QuestionType } from '$lib/model/question';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
	const body: {
		questionNumber: number;
		correct: boolean;
	} = await request.json();

	const quiz = params.quiz as QuestionType;

	await insertQuestionStats({
		questionType: quiz,
		questionNumber: body.questionNumber,
		correct: body.correct,
		timestamp: new Date()
	});

	return new Response(null, { status: 200 });
};
