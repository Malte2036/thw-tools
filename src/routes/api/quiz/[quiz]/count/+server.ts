import { connectToDatabase } from '$lib/Database';
import { sumArray } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { QuestionStats } from '$lib/model/questionStats';
import type { QuestionType } from '$lib/model/question';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;

		await connectToDatabase();

		return json(
			{
				right: await QuestionStats.countDocuments({
					questionType: quiz,
					correct: true
				}),
				wrong: await QuestionStats.countDocuments({
					questionType: quiz,
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
		console.warn(`Could not get quiz statistics from appwrite`, error);
	}

	return new Response(null, {
		status: 500,
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
};
