import { countQuestionStats } from '$lib/Database';
import type { QuestionType } from '$lib/model/question';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;
		const questionId = Number(params.questionId);

		return json(
			await countQuestionStats({
				questionType: quiz,
				questionNumber: questionId
			}),
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
