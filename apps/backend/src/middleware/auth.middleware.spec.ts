import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  const mockAuthService = {
    verifyToken: jest.fn(),
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

    it('should set user in request and call next() if token is valid', async () => {
      const mockPayload = {
        sub: 'user123',
        email: 'test@example.com',
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request;

      mockAuthService.verifyToken.mockResolvedValueOnce(mockPayload);

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest['user']).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
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
  });
});
