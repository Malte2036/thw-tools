import { MONGODB_URI } from '$env/static/private';
import mongoose from 'mongoose';
import { Question, type IQuestion } from './model/question';
import { QuestionStats, type IQuestionStats } from './model/questionStats';

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

export async function insertQuestionStats(stats: IQuestionStats) {
	await connectToDatabase();

	const questionStats = new QuestionStats(stats);
	await questionStats.save();
}

export async function countQuestionStats(
	params: Partial<IQuestionStats>
): Promise<{ right: number; wrong: number }> {
	await connectToDatabase();

	return {
		right: await QuestionStats.countDocuments({ ...params, correct: true }),
		wrong: await QuestionStats.countDocuments({ ...params, correct: false })
	};
}
