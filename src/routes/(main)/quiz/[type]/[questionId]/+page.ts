import { error } from '@sveltejs/kit';
import { databaseQuestionToExtendedQuestion, type QuestionType } from '$lib/quiz/question/Question';
import {
	getDatabaseQuestionByNumber,
	type DatabaseQuestion,
	getQuestionCount
} from '$lib/database/questions';
import type { PageLoad } from './$types';

export const ssr = false;

export type AnsweredCountData = {
	right: number;
	wrong: number;
};

export const load = (async ({ params }) => {
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
}) satisfies PageLoad;
