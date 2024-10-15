import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('knowledge-base/ask')
  async ask(@Body() { question }: { question: string }) {
    Logger.log(`Received question: ${question}`);
    if (!question) {
      throw new Error('Invalid question');
    }

    const answer = await this.aiService.askKnowledgeBase(question);
    Logger.log(`Answer: ${answer}`);

    return { answer };
  }
}
