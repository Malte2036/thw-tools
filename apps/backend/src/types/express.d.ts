import { AuthPayload } from './auth-payload';

declare module 'express' {
  export interface Request {
    user?: AuthPayload;
  }
}
