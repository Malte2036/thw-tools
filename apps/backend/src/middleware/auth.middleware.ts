import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = await this.authService.verifyToken(token);
    if (!payload) {
      this.logger.error(`JWT verification failed for token: ${token}`);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req['user'] = payload;
    next();
  }
}
