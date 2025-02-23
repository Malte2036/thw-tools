import { ExecutionContext, HttpException, ParamData } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserAndOrg, GetUserAndOrgOrThrow } from './user-org.decorator';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';
import { User } from '@prisma/client';
import {
  getUserAndOrgFactory,
  getUserAndOrgOrThrowFactory,
} from './user-org.decorator';

describe('UserOrg Decorators', () => {
  let mockUserService: Partial<UserService>;
  let mockOrgService: Partial<OrganisationService>;
  let mockExecutionContext: ExecutionContext;

  const mockUser = {
    id: '1',
    kindeId: 'kinde_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    picture: 'https://example.com/picture.jpg',
  } as User;

  const mockOrg = {
    id: '1',
    name: 'Test Org',
  };

  const mockRequest = {
    idTokenPayload: {
      sub: 'kinde_123',
      email: 'test@example.com',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://example.com/picture.jpg',
    },
    app: {
      get: jest.fn((service) => {
        if (service === UserService) return mockUserService;
        if (service === OrganisationService) return mockOrgService;
      }),
    },
  };

  beforeEach(() => {
    mockUserService = {
      createOrUpdate: jest.fn().mockResolvedValue(mockUser),
    };
    mockOrgService = {
      getPrimaryOrganisationsForUser: jest.fn().mockResolvedValue(mockOrg),
    };
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  describe('getUserAndOrgFactory', () => {
    it('should return user and org', async () => {
      const result = await getUserAndOrgFactory(null, mockExecutionContext);

      expect(result).toEqual([mockUser, mockOrg]);
      expect(mockUserService.createOrUpdate).toHaveBeenCalledWith('kinde_123', {
        kindeId: 'kinde_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'https://example.com/picture.jpg',
      });
      expect(
        mockOrgService.getPrimaryOrganisationsForUser,
      ).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle null org', async () => {
      mockOrgService.getPrimaryOrganisationsForUser = jest
        .fn()
        .mockResolvedValue(null);

      const result = await getUserAndOrgFactory(null, mockExecutionContext);

      expect(result).toEqual([mockUser, null]);
    });
  });

  describe('getUserAndOrgOrThrowFactory', () => {
    it('should return user and org when both exist', async () => {
      const result = await getUserAndOrgOrThrowFactory(
        null,
        mockExecutionContext,
      );

      expect(result).toEqual([mockUser, mockOrg]);
    });

    it('should throw when user not found', async () => {
      mockUserService.createOrUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        getUserAndOrgOrThrowFactory(null, mockExecutionContext),
      ).rejects.toThrow(new HttpException('User not found', 404));
    });

    it('should throw when org not found', async () => {
      mockOrgService.getPrimaryOrganisationsForUser = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        getUserAndOrgOrThrowFactory(null, mockExecutionContext),
      ).rejects.toThrow(
        new HttpException('Organisation for user not found', 404),
      );
    });
  });
});
