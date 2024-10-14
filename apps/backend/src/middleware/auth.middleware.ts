import { jwtVerify } from '@kinde-oss/kinde-node-express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const verifier = jwtVerify(process.env.KINDE_DOMAIN, {});

    // verify token
    verifier(req, res, (err) => {
      Logger.debug(`JWT verification took: ${Date.now() - start}ms`);
      if (err) {
        // Handle JWT verification error
        return res.status(401).json({ message: 'Unauthorized' });
      }

      next();
    });
  }
}
