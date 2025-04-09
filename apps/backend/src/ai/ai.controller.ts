import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private readonly aiService: AiService) {}

  @Post('knowledge-base/ask')
  async ask(@Res() response, @Body() { question }: { question: string }) {
    this.logger.log(`Received question: ${question}`);
    if (!question) {
      throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
    }

    return this.aiService.streamAskKnowledgeBase(response, question);
  }
}
