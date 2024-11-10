import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  AuthPayload,
  AuthPayloadSchema,
  IdTokenPayload,
  IdTokenPayloadSchema,
} from '../types/auth-payload';

@Injectable()
export class AuthService implements OnModuleInit {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
  private readonly jwksUrl = `${process.env.KINDE_DOMAIN}/.well-known/jwks.json`;

  private readonly logger = new Logger(AuthService.name);

  async onModuleInit() {
    const jwksRemote = createRemoteJWKSet(new URL(this.jwksUrl));
    this.jwks = jwksRemote;
  }

  async verifyToken(token: string): Promise<AuthPayload | null> {
    const start = Date.now();

    if (!token) {
      return null;
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        algorithms: ['RS256'],
      });

      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        this.logger.debug(`JWT verification took: ${elapsed}ms`);
      }

      return AuthPayloadSchema.parse(payload);
    } catch (error) {
      this.logger.error('JWT verification failed:', error);

      return null;
    }
  }

  async verifyIdToken(idToken: string): Promise<IdTokenPayload | null> {
    const start = Date.now();

    try {
      const { payload } = await jwtVerify(idToken, this.jwks, {
        algorithms: ['RS256'],
      });

      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        this.logger.debug(`JWT verification took: ${elapsed}ms`);
      }

      return IdTokenPayloadSchema.parse(payload);
    } catch (error) {
      this.logger.error('JWT verification failed:', error);

      return null;
    }
  }
}
