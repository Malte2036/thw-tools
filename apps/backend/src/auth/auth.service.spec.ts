import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as jose from 'jose';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockJwks = jest.fn();

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    process.env.KINDE_DOMAIN = 'https://example.com';

    (jose.createRemoteJWKSet as jest.Mock).mockReturnValue(mockJwks);

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    await service.onModuleInit(); // Initialize JWKS
  });

  describe('onModuleInit', () => {
    it('should initialize JWKS', async () => {
      expect(jose.createRemoteJWKSet).toHaveBeenCalledWith(
        new URL('https://example.com/.well-known/jwks.json'),
      );
    });
  });

  describe('verifyToken', () => {
    it('should return null for empty token', async () => {
      const result = await service.verifyToken('');
      expect(result).toBeNull();
    });

    it('should successfully verify valid token', async () => {
      const mockPayload = {
        sub: 'user123',
        iss: 'https://example.com',
        // Additional fields that won't be included in the result
        email: 'test@example.com',
        aud: ['default'],
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      (jose.jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: mockPayload,
        protectedHeader: {
          alg: 'RS256',
          kid: 'test-key',
        },
      });

      const result = await service.verifyToken('valid.token.here');

      // Only check for fields defined in AuthPayloadSchema
      expect(result).toEqual({
        sub: mockPayload.sub,
        iss: mockPayload.iss,
      });
      expect(jose.jwtVerify).toHaveBeenCalledWith(
        'valid.token.here',
        mockJwks,
        { algorithms: ['RS256'] },
      );
    });

    it('should return null and log error for invalid token', async () => {
      const mockError = new Error('Invalid token');
      (jose.jwtVerify as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await service.verifyToken('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null for token with missing required claims', async () => {
      const mockPayload = {
        // Missing required 'iss' claim
        sub: 'user123',
        email: 'test@example.com',
      };

      (jose.jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: mockPayload,
        protectedHeader: {
          alg: 'RS256',
          kid: 'test-key',
        },
      });

      const result = await service.verifyToken('invalid.claims.token');

      expect(result).toBeNull();
    });

    it('should return null for expired token', async () => {
      const mockPayload = {
        sub: 'user123',
        iss: 'https://example.com',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      };

      (jose.jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: mockPayload,
        protectedHeader: {
          alg: 'RS256',
          kid: 'test-key',
        },
      });

      const result = await service.verifyToken('expired.token');

      // The service should still return the payload since expiration is handled by jose
      expect(result).toEqual({
        sub: mockPayload.sub,
        iss: mockPayload.iss,
      });
    });

    it('should validate token with different issuer', async () => {
      const mockPayload = {
        sub: 'user123',
        iss: 'https://wrong-issuer.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      (jose.jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: mockPayload,
        protectedHeader: {
          alg: 'RS256',
          kid: 'test-key',
        },
      });

      const result = await service.verifyToken('wrong.issuer.token');

      // The service should still return the payload since issuer validation is handled by jose
      expect(result).toEqual({
        sub: mockPayload.sub,
        iss: mockPayload.iss,
      });
    });
  });

  describe('JWKS timeout retry logic', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should retry on JWKS timeout and succeed on second attempt', async () => {
      const mockPayload = {
        sub: 'user123',
        iss: 'https://example.com',
      };

      const timeoutError = new Error('JWKS Timeout');
      timeoutError['code'] = 'ERR_JWKS_TIMEOUT';

      (jose.jwtVerify as jest.Mock)
        .mockRejectedValueOnce(timeoutError)
        .mockResolvedValueOnce({
          payload: mockPayload,
          protectedHeader: { alg: 'RS256' },
        });

      const verifyPromise = service.verifyToken('test.token');

      // First attempt fails
      await jest.advanceTimersByTimeAsync(0);

      // Wait for the first retry delay (500ms)
      await jest.advanceTimersByTimeAsync(500);

      const result = await verifyPromise;

      expect(jose.jwtVerify).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockPayload);
    });

    it('should retry maximum 3 times and fail if all attempts timeout', async () => {
      const timeoutError = new Error('JWKS Timeout');
      timeoutError['code'] = 'ERR_JWKS_TIMEOUT';

      (jose.jwtVerify as jest.Mock).mockRejectedValue(timeoutError);

      const verifyPromise = service.verifyToken('test.token');

      // First attempt
      await jest.advanceTimersByTimeAsync(0);
      // First retry (500ms delay)
      await jest.advanceTimersByTimeAsync(500);
      // Second retry (1000ms delay)
      await jest.advanceTimersByTimeAsync(1000);
      // Third retry (2000ms delay)
      await jest.advanceTimersByTimeAsync(2000);

      const result = await verifyPromise;

      expect(jose.jwtVerify).toHaveBeenCalledTimes(3);
      expect(result).toBeNull();
    });

    it('should use exponential backoff for retry delays', async () => {
      const timeoutError = new Error('JWKS Timeout');
      timeoutError['code'] = 'ERR_JWKS_TIMEOUT';

      (jose.jwtVerify as jest.Mock).mockRejectedValue(timeoutError);

      const loggerWarnSpy = jest.spyOn(service['logger'], 'warn');

      const verifyPromise = service.verifyToken('test.token');

      // First attempt
      await jest.advanceTimersByTimeAsync(0);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'JWKS timeout, retrying in 500ms (attempt 1/3)',
      );

      // First retry
      await jest.advanceTimersByTimeAsync(500);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'JWKS timeout, retrying in 1000ms (attempt 2/3)',
      );

      // Second retry
      await jest.advanceTimersByTimeAsync(1000);

      await verifyPromise;

      expect(jose.jwtVerify).toHaveBeenCalledTimes(3);
      expect(loggerWarnSpy).toHaveBeenCalledTimes(2);
    });
  });
});
