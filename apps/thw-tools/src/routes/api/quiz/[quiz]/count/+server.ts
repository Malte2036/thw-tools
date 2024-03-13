import type { RequestEvent, RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { QuestionType } from '$lib/quiz/question/Question';
import { getCorrectCount, getQuestionCount } from '$lib/Database';
import { sumArray } from '$lib/utils';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
	try {
		const quiz = params.quiz as QuestionType;
		const questionCount = await getQuestionCount(quiz);
		const allQuestionNumbers = Array.from({ length: questionCount }, (_, i) => i + 1);

		// get correct count for every question
		const right = sumArray(
			await Promise.all(allQuestionNumbers.map((n) => getCorrectCount(quiz, true, n)))
		);
		const wrong = sumArray(
			await Promise.all(allQuestionNumbers.map((n) => getCorrectCount(quiz, false, n)))
		);

		return json(
			{
				right,
				wrong
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
