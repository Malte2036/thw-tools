import { jwtVerify } from '@kinde-oss/kinde-node-express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const verifier = jwtVerify(process.env.KINDE_DOMAIN, {});

    // verify token
    verifier(req, res, (err) => {
      if (err) {
        // Handle JWT verification error
        return res.status(401).json({ message: 'Unauthorized' });
      }

      next();
    });
  }
}
