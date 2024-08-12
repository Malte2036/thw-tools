import { countQuestions, findQuestion } from '$lib/Database';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { QuestionType } from '$lib/model/question';

export type AnsweredCountData = {
	questionType: QuestionType;
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber = Number.parseInt(params.questionId!);

	const question = await findQuestion({ type: questionType, number: questionNumber });

	if (!question) {
		error(404, 'Question not found');
	}

	const questionCount = await countQuestions({ type: questionType });

	const nextQuestionId = (questionNumber % questionCount) + 1;

	return {
		question,
		questionType,
		questionCount,
		nextQuestionId
	};
}) satisfies PageServerLoad;
