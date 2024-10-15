import { z } from 'zod';

export const AiKnowledgeBaseAnswerSchema = z.object({
  response: z.string(),
});
