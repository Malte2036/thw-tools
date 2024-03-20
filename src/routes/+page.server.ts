import { connectToDatabase } from '$lib/Database';
import { Question, QuestionType } from '$lib/model/question';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({}) => {
	const questionTypes: QuestionType[] = Object.values(QuestionType);

	const questionTypeLength = new Map();

	await connectToDatabase();

	await Promise.all(
		questionTypes.map(async (t) => {
			const count = await Question.countDocuments({ type: t });
			questionTypeLength.set(t, count);
		})
	);

	return {
		questionTypeLength
	};
}) satisfies PageServerLoad;
