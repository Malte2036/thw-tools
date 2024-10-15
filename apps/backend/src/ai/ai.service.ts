import { Injectable, Logger } from '@nestjs/common';
import { AiKnowledgeBaseAnswerSchema } from './schemas/ai-knowledge-base-answer.model';

@Injectable()
export class AiService {
  async askKnowledgeBase(question: string): Promise<string> {
    const response = await fetch(
      `${process.env.THW_TOOLS_AI_SERVICE_URL}/ask`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: question,
        }),
      },
    );

    const json = await response.json();

    const validationResult = AiKnowledgeBaseAnswerSchema.safeParse(json);

    if (!validationResult.success) {
      Logger.debug(json);
      Logger.error(validationResult.error.errors);
      throw new Error('Invalid response from AI service');
    }

    return validationResult.data.response;
  }
}
