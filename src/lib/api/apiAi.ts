import { z } from 'zod';
import { apiPost } from './apiGeneric';

export const AiKnowledgeBaseAskApiResponseSchema = z.object({
	answer: z.string()
});

export type AiKnowledgeBaseAskApiResponse = z.infer<typeof AiKnowledgeBaseAskApiResponseSchema>;

export const askAiKnowledgeBase = async (question: string) => {
	return apiPost<AiKnowledgeBaseAskApiResponse>(
		'/ai/knowledge-base/ask',
		{ question },

		(data) => {
			const result = AiKnowledgeBaseAskApiResponseSchema.safeParse(data);
			if (!result.success) {
				console.error('Error parsing AiKnowledgeBaseAskApiResponse:', result.error);
			}
			return result.success;
		}
	);
};
