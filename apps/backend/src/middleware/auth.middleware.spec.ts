import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  const mockAuthService = {
    verifyToken: jest.fn(),
    verifyIdToken: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    middleware = module.get<AuthMiddleware>(AuthMiddleware);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should return 401 if no authorization header is present', async () => {
      const mockRequest = {
        headers: {},
      } as Request;

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if no id token header is present', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce({
        sub: 'user1',
        iss: 'https://example.com',
      });

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(null);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
      const mockRequest = {
        headers: {
          authorization: 'malformed-header',
        },
      } as Request;

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should log error when token verification fails', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(null);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(loggerSpy).toHaveBeenCalledWith(
        'JWT verification failed for token: invalid-token',
      );
    });

    it('should return 401 when token and id token subjects do not match', async () => {
      const mockAccessTokenPayload = {
        sub: 'user1',
        iss: 'https://example.com',
        aud: ['api'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockIdTokenPayload = {
        sub: 'user2', // Different subject
        iss: 'https://example.com',
        aud: ['api'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(mockAccessTokenPayload);
      mockAuthService.verifyIdToken.mockResolvedValueOnce(mockIdTokenPayload);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRequest['idTokenPayload']).toBeUndefined();
    });

    it('should return 401 when token and id token issuers do not match', async () => {
      const mockAccessTokenPayload = {
        sub: 'user1',
        iss: 'https://example.com',
        aud: ['api'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockIdTokenPayload = {
        sub: 'user1',
        iss: 'https://different-issuer.com', // Different issuer
        aud: ['api'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(mockAccessTokenPayload);
      mockAuthService.verifyIdToken.mockResolvedValueOnce(mockIdTokenPayload);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for expired tokens', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expired-token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(null); // Expired token should return null

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('should return 401 for tokens with invalid audience', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(null); // Invalid audience should return null

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('should return 401 for tokens with null values in critical fields', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce({
        sub: null, // Critical field is null
        iss: 'https://example.com',
      });

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('should set idTokenPayload and call next() when tokens match and are valid', async () => {
      const now = Math.floor(Date.now() / 1000);
      const mockAccessTokenPayload = {
        sub: 'user1',
        iss: 'https://example.com',
        aud: ['api'],
        exp: now + 3600,
        iat: now,
        jti: 'unique-token-id', // Prevent token replay
      };

      const mockIdTokenPayload = {
        sub: 'user1',
        iss: 'https://example.com',
        aud: ['api'],
        exp: now + 3600,
        iat: now,
        jti: 'unique-id-token-id',
        // Additional id token fields
        email: 'test@example.com',
        email_verified: true,
        name: 'Test User',
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
          'x-id-token': 'valid-id-token',
        },
      } as Partial<Request> as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(mockAccessTokenPayload);
      mockAuthService.verifyIdToken.mockResolvedValueOnce(mockIdTokenPayload);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockAuthService.verifyIdToken).toHaveBeenCalledWith(
        'valid-id-token',
      );
      expect(mockRequest['idTokenPayload']).toEqual(mockIdTokenPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
