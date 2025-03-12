import { PUBLIC_API_URL } from '$env/static/public';
import {
	questionSchema,
	questionsStatsCountSchema,
	type Question,
	type QuestionsStatsCount,
	type QuestionType
} from '$lib/model/question';
import { z } from 'zod';

export async function getQuestionStatsCount(questionId: number): Promise<QuestionsStatsCount> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/stats/count/${questionId}`);

	if (!res.ok) {
		throw new Error('Failed to fetch question stats count');
	}

	const json = await res.json();
	return questionsStatsCountSchema.parse(json);
}

export async function addQuestionStatsCount(questionId: number, correct: boolean): Promise<void> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/stats/count/${questionId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			correct
		})
	});

	if (!res.ok) {
		throw new Error('Failed to add question stats count');
	}
}

export async function getQuestionStatsCountForType(
	questionType: QuestionType
): Promise<QuestionsStatsCount> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/stats/count`);

	if (!res.ok) {
		throw new Error('Failed to fetch question stats count for type');
	}

	const json = await res.json();
	return questionsStatsCountSchema.parse(json);
}

export async function getQuestion(
	questionType: QuestionType,
	questionId: number
): Promise<Question> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/${questionId}`);

	if (!res.ok) {
		throw new Error('Failed to fetch question');
	}

	const json = await res.json();
	return questionSchema.parse(json);
}

export async function getQuestions(questionType: QuestionType): Promise<Question[]> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}`);

	if (!res.ok) {
		throw new Error('Failed to fetch questions');
	}

	const json = await res.json();
	return json.map((question: Question) => questionSchema.parse(question));
}

export async function getQuestionCount(questionType: QuestionType): Promise<number> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/count`);

	if (!res.ok) {
		throw new Error('Failed to fetch question count');
	}

	const json = await res.json();
	return z.number().parse(json);
}
