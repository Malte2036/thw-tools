import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AiService {
  async streamAskKnowledgeBase(response: Response, question: string) {
    const fetchResponse = await fetch(
      `${process.env.THW_TOOLS_AI_SERVICE_URL}/ask/stream`,
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

    response.status(fetchResponse.status);
    fetchResponse.headers.forEach((value, name) => {
      response.setHeader(name, value);
    });
    // Stream directly to the response
    const reader = fetchResponse.body.getReader();
    const writer = response;

    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        writer.end();
        return;
      }
      writer.write(value);
      pump();
    };

    pump();
  }
}
