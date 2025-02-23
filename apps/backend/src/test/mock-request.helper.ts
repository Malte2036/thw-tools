import { Request } from 'express';
import { User, Organisation } from '@prisma/client';

export function createMockRequest(params: {
  user?: User | null;
  organisation?: Organisation | null;
  idTokenPayload?: any;
}): Request {
  const baseRequest = {
    user: params.user ?? null,
    organisation: params.organisation ?? null,
    idTokenPayload: params.idTokenPayload,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    param: jest.fn(),
    is: jest.fn(),
    cookies: {},
    query: {},
    params: {},
    body: {},
    method: 'GET',
    url: '/',
  };

  return baseRequest as unknown as Request;
}
