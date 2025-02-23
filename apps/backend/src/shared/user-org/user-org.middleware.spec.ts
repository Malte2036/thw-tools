import { Test, TestingModule } from '@nestjs/testing';
import { UserOrgMiddleware } from './user-org.middleware';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';
import { Request, Response } from 'express';
import { createMockRequest } from '../../test/mock-request.helper';

describe('UserOrgMiddleware', () => {
  let middleware: UserOrgMiddleware;
  let mockUserService: Partial<UserService>;
  let mockOrgService: Partial<OrganisationService>;

  const mockUser = {
    id: '1',
    kindeId: 'kinde_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    picture: 'https://example.com/picture.jpg',
  };

  const mockOrg = {
    id: '1',
    name: 'Test Org',
    inviteCode: 'test-invite',
  };

  beforeEach(async () => {
    mockUserService = {
      createOrUpdate: jest.fn().mockResolvedValue(mockUser),
    };
    mockOrgService = {
      getPrimaryOrganisationsForUser: jest.fn().mockResolvedValue(mockOrg),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOrgMiddleware,
        { provide: UserService, useValue: mockUserService },
        { provide: OrganisationService, useValue: mockOrgService },
      ],
    }).compile();

    middleware = module.get<UserOrgMiddleware>(UserOrgMiddleware);
  });

  it('should set user and organisation when idTokenPayload exists', async () => {
    const mockRequest = {
      idTokenPayload: {
        sub: 'kinde_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/picture.jpg',
      },
    } as Request;

    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBe(mockUser);
    expect(mockRequest.organisation).toBe(mockOrg);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should set null values when idTokenPayload is missing', async () => {
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBeNull();
    expect(mockRequest.organisation).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should set null values when user creation fails', async () => {
    const mockRequest = {
      idTokenPayload: {
        sub: 'kinde_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/picture.jpg',
      },
    } as Request;

    mockUserService.createOrUpdate = jest.fn().mockResolvedValue(null);

    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBeNull();
    expect(mockRequest.organisation).toBeNull();
    expect(mockNext).toHaveBeenCalled();
    expect(
      mockOrgService.getPrimaryOrganisationsForUser,
    ).not.toHaveBeenCalled();
  });

  it('should set null organisation when getPrimaryOrganisationsForUser fails', async () => {
    const mockRequest = {
      idTokenPayload: {
        sub: 'kinde_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/picture.jpg',
      },
    } as Request;

    mockOrgService.getPrimaryOrganisationsForUser = jest
      .fn()
      .mockResolvedValue(null);

    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBe(mockUser);
    expect(mockRequest.organisation).toBeNull();
    expect(mockNext).toHaveBeenCalled();
    expect(mockOrgService.getPrimaryOrganisationsForUser).toHaveBeenCalledWith(
      mockUser.id,
    );
  });

  it('should handle errors gracefully and set null values', async () => {
    const mockRequest = createMockRequest({
      idTokenPayload: {
        sub: 'kinde_123',
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/picture.jpg',
      },
    });

    mockUserService.createOrUpdate = jest
      .fn()
      .mockRejectedValue(new Error('DB Error'));

    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    await middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBeNull();
    expect(mockRequest.organisation).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });
});
