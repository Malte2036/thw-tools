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
  });

  describe('onModuleInit', () => {
    it('should initialize JWKS', async () => {
      await service.onModuleInit();

      expect(jose.createRemoteJWKSet).toHaveBeenCalledWith(expect.any(URL));
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
        email: 'test@example.com',
      };

      (jose.jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: mockPayload,
      });

      await service.onModuleInit(); // Initialize JWKS
      const result = await service.verifyToken('valid.token.here');

      expect(result).toEqual(mockPayload);
      expect(jose.jwtVerify).toHaveBeenCalledWith(
        'valid.token.here',
        mockJwks,
        { algorithms: ['RS256'] },
      );
    });

    it('should return null and log error for invalid token', async () => {
      const mockError = new Error('Invalid token');
      (jose.jwtVerify as jest.Mock).mockRejectedValueOnce(mockError);

      await service.onModuleInit(); // Initialize JWKS
      const result = await service.verifyToken('invalid.token');

      expect(result).toBeNull();
    });
  });
});
