import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';
import { User } from '@prisma/client';
import {
  getUserAndOrgFromRequest,
  getUserAndOrgFromRequestAndThrow,
} from './user-org.util';

describe('UserOrg Utils', () => {
  let mockUserService: Partial<UserService>;
  let mockOrgService: Partial<OrganisationService>;

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
  } as any;

  beforeEach(() => {
    mockUserService = {
      createOrUpdate: jest.fn().mockResolvedValue(mockUser),
    };
    mockOrgService = {
      getPrimaryOrganisationsForUser: jest.fn().mockResolvedValue(mockOrg),
    };
  });

  describe('getUserAndOrgFromRequest', () => {
    it('should return user and org', async () => {
      const result = await getUserAndOrgFromRequest(
        mockRequest,
        mockUserService as UserService,
        mockOrgService as OrganisationService,
      );

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

    it('should handle missing user data in token', async () => {
      const minimalRequest = {
        idTokenPayload: {
          sub: 'kinde_123',
        },
      } as any;

      await getUserAndOrgFromRequest(
        minimalRequest,
        mockUserService as UserService,
        mockOrgService as OrganisationService,
      );

      expect(mockUserService.createOrUpdate).toHaveBeenCalledWith('kinde_123', {
        kindeId: 'kinde_123',
      });
    });
  });

  describe('getUserAndOrgFromRequestAndThrow', () => {
    it('should return user and org when both exist', async () => {
      const result = await getUserAndOrgFromRequestAndThrow(
        mockRequest,
        mockUserService as UserService,
        mockOrgService as OrganisationService,
      );

      expect(result).toEqual([mockUser, mockOrg]);
    });

    it('should throw when user not found', async () => {
      mockUserService.createOrUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        getUserAndOrgFromRequestAndThrow(
          mockRequest,
          mockUserService as UserService,
          mockOrgService as OrganisationService,
        ),
      ).rejects.toThrow(new HttpException('User not found', 404));
    });

    it('should throw when org not found', async () => {
      mockOrgService.getPrimaryOrganisationsForUser = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        getUserAndOrgFromRequestAndThrow(
          mockRequest,
          mockUserService as UserService,
          mockOrgService as OrganisationService,
        ),
      ).rejects.toThrow(
        new HttpException('Organisation for user not found', 404),
      );
    });

    it('should handle invalid token payload', async () => {
      const invalidRequest = {
        idTokenPayload: null,
      } as any;

      await expect(
        getUserAndOrgFromRequestAndThrow(
          invalidRequest,
          mockUserService as UserService,
          mockOrgService as OrganisationService,
        ),
      ).rejects.toThrow();
    });
  });
});
