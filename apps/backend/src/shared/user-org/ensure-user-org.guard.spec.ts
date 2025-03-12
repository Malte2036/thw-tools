import { ExecutionContext } from '@nestjs/common';
import { EnsureUserAndOrgGuard, SKIP_ORG_CHECK } from './ensure-user-org.guard';
import { HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('EnsureUserAndOrgGuard', () => {
  let guard: EnsureUserAndOrgGuard;
  let mockContext: ExecutionContext;
  let reflector: Reflector;

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
    reflector = new Reflector();
    guard = new EnsureUserAndOrgGuard(reflector);
  });

  it('should allow access when user and organisation exist', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: mockOrg,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw when user is missing', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          organisation: mockOrg,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should throw when organisation is missing and org check is not skipped', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: null,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should allow access when organisation is missing but org check is skipped', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: null,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw when request object is missing', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => undefined,
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(HttpException);
  });

  it('should throw with correct status code and message for missing user', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          organisation: mockOrg,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    try {
      guard.canActivate(mockContext);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(404);
      expect(error.message).toBe('User not found');
    }
  });

  it('should throw with correct status code and message for missing organisation', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
          organisation: null,
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    try {
      guard.canActivate(mockContext);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(404);
      expect(error.message).toBe('Organisation not found');
    }
  });
});
