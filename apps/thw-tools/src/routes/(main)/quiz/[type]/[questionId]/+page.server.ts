import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { databaseQuestionToExtendedQuestion, type QuestionType } from '$lib/quiz/question/Question';
import {
	getDatabaseQuestionByNumber,
	getQuestionCount,
	type DatabaseQuestion
} from '$lib/Database';

export type AnsweredCountData = {
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber = Number.parseInt(params.questionId!);

	var databaseQuestion: DatabaseQuestion;

	try {
		databaseQuestion = await getDatabaseQuestionByNumber(
			questionType,
			Number.parseInt(params.questionId!)
		);
	} catch (err) {
		const message = `Id "${params.questionId}" for quiz type "${questionType}" not found!`;
		console.error(message);
		console.error(err);

		throw error(404, {
			message
		});
	}

	const question = databaseQuestionToExtendedQuestion(databaseQuestion);

	const questionCount = await getQuestionCount(questionType);

	const nextQuestionId = (questionNumber % questionCount) + 1;

	return {
		question,
		questionType,
		questionCount,
		nextQuestionId
	};
}) satisfies PageServerLoad;
