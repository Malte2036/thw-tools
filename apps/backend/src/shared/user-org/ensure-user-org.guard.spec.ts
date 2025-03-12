import { ExecutionContext } from '@nestjs/common';
import { EnsureUserAndOrgGuard } from './ensure-user-org.guard';
import { HttpException } from '@nestjs/common';

describe('EnsureUserAndOrgGuard', () => {
  let guard: EnsureUserAndOrgGuard;
  let mockContext: ExecutionContext;

  const mockUser = {
    id: '1',
    kindeId: 'kinde_123',
    email: 'test@example.com',
  };

  const mockOrg = {
    id: '1',
    name: 'Test Org',
  };

  beforeEach(() => {
    guard = new EnsureUserAndOrgGuard();
  });

  it('should allow access when user and organisation exist', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: mockOrg,
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw when user is missing', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          organisation: mockOrg,
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should throw when organisation is missing', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: null,
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should throw when request object is missing', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => undefined,
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should throw with correct status code and message', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          organisation: mockOrg,
        }),
      }),
    } as ExecutionContext;

    try {
      guard.canActivate(mockContext);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(403);
      expect(error.message).toBe('User or organisation not found');
    }
  });

  it('should throw when both user and organisation are null', () => {
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          organisation: null,
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });
});
