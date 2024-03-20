import { MONGODB_CONNECTION_STRING } from '$env/static/private';
import { getQuestionCount } from '$lib/Database';
import { Question, type QuestionType } from '$lib/model/question';
import { error } from '@sveltejs/kit';
import mongoose from 'mongoose';
import type { PageServerLoad } from './$types';

export type AnsweredCountData = {
	right: number;
	wrong: number;
};

export const prerender = true;

export const load = (async ({ params, depends }) => {
	const questionType: QuestionType | undefined = params.type as QuestionType;

	const questionNumber = Number.parseInt(params.questionId!);

	mongoose.connect(MONGODB_CONNECTION_STRING);
	const question = await Question.findOne({ type: questionType, number: questionNumber }).select(
		'-_id'
	);

	if (!question) {
		throw error(404, 'Question not found');
	}

	const questionCount = await getQuestionCount(questionType);

	const nextQuestionId = (questionNumber % questionCount) + 1;

	return {
		question: question.toObject(),
		questionType,
		questionCount,
		nextQuestionId
	};
}) satisfies PageServerLoad;
