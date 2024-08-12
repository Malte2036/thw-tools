import { PUBLIC_API_URL } from '$env/static/public';
import type { IQuestion, QuestionType } from '$lib/model/question';

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

function mapResponseQuestion(question: any): IQuestion {
	// fix strange answers format
	const answers: IQuestion['answers'] = new Map();
	for (const [key, value] of Object.entries(question.answers)) {
		answers.set(parseInt(key), value as string);
	}

	return {
		...question,
		answers,
		correctIndices: question.correctIndices.map((i: any) => parseInt(i))
	} satisfies IQuestion;
}

export async function getQuestion(
	questionType: QuestionType,
	questionId: number
): Promise<IQuestion> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/${questionId}`);

	if (!res.ok) {
		throw new Error('Failed to fetch question');
	}

	return mapResponseQuestion(await res.json());
}

export async function getQuestions(questionType: QuestionType): Promise<IQuestion[]> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}`);

	if (!res.ok) {
		throw new Error('Failed to fetch questions');
	}

	const json = await res.json();
	return json.map(mapResponseQuestion);
}

export async function getQuestionCount(questionType: QuestionType): Promise<number> {
	const res = await fetch(`${PUBLIC_API_URL}/quiz/${questionType}/count`);

	if (!res.ok) {
		throw new Error('Failed to fetch question count');
	}

	return await res.json();
}
