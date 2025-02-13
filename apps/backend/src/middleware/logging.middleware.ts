import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      if (elapsed > 0) {
        // Log if response time exceeds 500ms (customizable)
        this.logger.warn(`${req.method} ${req.originalUrl} took ${elapsed}ms`);
      }
    });

    next();
  }
}
