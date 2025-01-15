import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  AuthPayload,
  AuthPayloadSchema,
  IdTokenPayload,
  IdTokenPayloadSchema,
} from '../types/auth-payload';
import { ZodError } from 'zod';

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
    if (!token) return null;
    const result = await this.verifyTokenWithRetry(token);
    if (!result) return null;

    try {
      return AuthPayloadSchema.parse(result.payload);
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error('Token payload validation failed:', error.errors);
      }
      return null;
    }
  }

  async verifyIdToken(idToken: string): Promise<IdTokenPayload | null> {
    const result = await this.verifyTokenWithRetry(idToken);
    if (!result) return null;

    try {
      return IdTokenPayloadSchema.parse(result.payload);
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error('ID token payload validation failed:', error.errors);
      }
      return null;
    }
  }

  private async verifyTokenWithRetry(
    token: string,
    maxRetries = 3,
    initialDelay = 500,
  ): Promise<{ payload: any } | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const start = Date.now();
        const result = await jwtVerify(token, this.jwks, {
          algorithms: ['RS256'],
        });

        const elapsed = Date.now() - start;
        if (elapsed > 500) {
          this.logger.debug(`JWT verification took: ${elapsed}ms`);
        }

        return result;
      } catch (error) {
        if (error.code === 'ERR_JWKS_TIMEOUT' && attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt);
          this.logger.warn(
            `JWKS timeout, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        this.logger.error(
          error.code === 'ERR_JWKS_TIMEOUT'
            ? 'JWKS request timed out after all retries'
            : 'JWT verification failed:',
          error,
        );
        return null;
      }
    }
    return null;
  }
}
