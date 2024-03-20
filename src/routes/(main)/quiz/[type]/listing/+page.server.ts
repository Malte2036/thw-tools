import { connectToDatabase } from '$lib/Database';
import { Question, type QuestionType } from '$lib/model/question';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	await connectToDatabase();

	const allQuestions = await Question.find({ type: questionType }).select('-_id');
	return {
		questionType,
		allQuestions: allQuestions.map((q) => q.toObject())
	};
}) satisfies PageServerLoad;
