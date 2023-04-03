import type { RequestEvent, RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { QuestionType } from '$lib/quiz/question/Question';
import { getCorrectCount } from '$lib/Database';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;

		return json(
			{
				right: await getCorrectCount(quiz, true),
				wrong: await getCorrectCount(quiz, false)
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
