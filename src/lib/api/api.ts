import { PUBLIC_API_URL } from '$env/static/public';
import type { QuestionType } from '$lib/model/question';

export type QuestionsStatsCount = {
	questionType: QuestionType;
	right: number;
	wrong: number;
};

export async function getQuestionStatsCountForType(
	questionType: QuestionType,
	questionId?: number
): Promise<QuestionsStatsCount> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/stats/count/${questionId ?? ''}`);

	if (!res.ok) {
		throw new Error('Failed to fetch question stats count');
	}

	return await res.json();
}

export async function addQuestionStatsCountForType(
	questionType: QuestionType,
	questionId: number,
	correct: boolean
): Promise<void> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/stats/count/${questionId}`, {
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
