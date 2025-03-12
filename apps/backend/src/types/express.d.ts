import { IdTokenPayload } from './auth-payload';
import { User, Organisation } from '@prisma/client';

declare module 'express' {
  export interface Request {
    idTokenPayload?: IdTokenPayload;
    user?: User | null;
    organisation?: Organisation | null;
  }
}
