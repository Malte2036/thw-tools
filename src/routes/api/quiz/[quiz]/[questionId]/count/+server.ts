import { connectToDatabase } from '$lib/Database';
import type { QuestionType } from '$lib/model/question';
import { QuestionStats } from '$lib/model/questionStats';
import type { RequestEvent, RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;
		const questionId = Number(params.questionId);

		await connectToDatabase();

		return json(
			{
				right: await QuestionStats.countDocuments({
					questionType: quiz,
					questionNumber: questionId,
					correct: true
				}),
				wrong: await QuestionStats.countDocuments({
					questionType: quiz,
					questionNumber: questionId,
					correct: false
				})
			},
			{
				headers: {
					'Cache-Control': 'no-cache'
				}
			}
		);
	} catch (error) {
		console.warn(`Could not get quiz statistics from database: ${error}`);
	}

	return new Response(null, {
		status: 500,
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
};
