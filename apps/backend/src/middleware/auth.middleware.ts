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

    const tokenPayload = await this.authService.verifyToken(token);
    if (!tokenPayload) {
      this.logger.error(`JWT verification failed for token: ${token}`);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const idToken = req.headers['x-id-token'];
    if (!idToken) {
      this.logger.error('No id token provided');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const idTokenPayload = await this.authService.verifyIdToken(
      idToken as string,
    );

    if (!idTokenPayload) {
      this.logger.error('Invalid id token');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (
      tokenPayload.sub !== idTokenPayload.sub ||
      tokenPayload.iss !== idTokenPayload.iss
    ) {
      this.logger.error('Token or id token mismatch');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req['idTokenPayload'] = idTokenPayload;

    next();
  }
}
