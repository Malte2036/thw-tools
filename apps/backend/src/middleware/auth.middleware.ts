import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { AuthPayloadSchema } from 'src/types/auth-payload';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly jwksUrl = `${process.env.KINDE_DOMAIN}/.well-known/jwks.json`;
  private readonly logger = new Logger(AuthMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const jwks = createRemoteJWKSet(new URL(this.jwksUrl));

      const { payload } = await jwtVerify(token, jwks, {
        algorithms: ['RS256'],
      });

      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        this.logger.debug(`JWT verification took: ${elapsed}ms`);
      }

      req['user'] = AuthPayloadSchema.parse(payload);

      next();
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error}`);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
