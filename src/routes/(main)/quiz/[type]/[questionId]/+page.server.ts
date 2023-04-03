import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { databaseQuestionToExtendedQuestion, type QuestionType } from '$lib/quiz/question/Question';
import { getDatabaseQuestionByNumber, getQuestionCount } from '$lib/Database';

export type AnsweredCountData = {
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber = Number.parseInt(params.questionId!);

	const databaseQuestion = await getDatabaseQuestionByNumber(
		questionType,
		Number.parseInt(params.questionId!)
	);
	const question = databaseQuestionToExtendedQuestion(databaseQuestion);

	if (question === undefined) {
		throw error(404, {
			message: `Id "${params.questionId}" for quiz type "${questionType}" not found!`
		});
	}

	const questionCount = await getQuestionCount(questionType);

	const nextQuestionId = (questionNumber + 1) % questionCount;

	return {
		question,
		questionType,
		questionCount,
		nextQuestionId
	};
}) satisfies PageServerLoad;
