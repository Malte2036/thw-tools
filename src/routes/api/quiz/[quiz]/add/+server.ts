import type { RequestEvent, RequestHandler } from './$types';
import type { QuestionType } from '$lib/quiz/question/Question';
import { addCount, type StatisticsData } from '$lib/Database';

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
	const body: StatisticsData = await request.json();

	try {
		const quiz = params.quiz as QuestionType;

		await addCount(quiz, body);
	} catch (error) {
		console.warn(`Could not write agt quiz statistics to appwrite`, error);
	}

	return new Response(null, { status: 200 });
};
