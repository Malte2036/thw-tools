import { IdTokenPayload } from './auth-payload';

declare module 'express' {
  export interface Request {
    idTokenPayload?: IdTokenPayload;
  }
}
