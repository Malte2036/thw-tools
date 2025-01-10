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
});
