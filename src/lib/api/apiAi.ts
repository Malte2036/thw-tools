import { apiPostStream } from './apiGeneric';

export const streamAskAiKnowledgeBase = async function (question: string) {
	return apiPostStream<string>('/ai/knowledge-base/ask', { question });
};
