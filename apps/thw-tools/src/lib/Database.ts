import { MONGODB_URI } from '$env/static/private';
import mongoose from 'mongoose';
import { Question, type IQuestion } from './model/question';

async function connectToDatabase() {
	if (mongoose.connection.readyState) {
		return;
	}

	await mongoose.connect(MONGODB_URI);
}

export async function findQuestion(
	params: Partial<IQuestion>,
	select?: string
): Promise<IQuestion | null> {
	await connectToDatabase();

	const question = await Question.findOne(params).select(select ?? '-_id');
	return question?.toObject() ?? null;
}

export async function findQuestions(
	params: Partial<IQuestion>,
	select?: string
): Promise<IQuestion[]> {
	await connectToDatabase();

	const questions = await Question.find(params).select(select ?? '-_id');
	return questions.map((question) => question.toObject());
}

export async function countQuestions(params: Partial<IQuestion>): Promise<number> {
	await connectToDatabase();

	return await Question.countDocuments(params);
}
