import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { Logger, HttpException } from '@nestjs/common';
import type { User, Organisation, OrganisationMember } from '@prisma/client';

describe('OrganisationController', () => {
  let controller: OrganisationController;
  let service: jest.Mocked<OrganisationService>;

  const mockUser: User = {
    id: 'user-1',
    kindeId: 'kinde-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    picture: 'https://example.com/picture.jpg',
  };

  const mockOrgMember: OrganisationMember & { user: User } = {
    userId: mockUser.id,
    organisationId: 'org-1',
    user: mockUser,
  };

  const mockOrganisation: Organisation & {
    members: (OrganisationMember & { user: User })[];
  } = {
    id: 'org-1',
    name: 'Test Org',
    inviteCode: 'invite-123',
    members: [mockOrgMember],
  };

  beforeEach(async () => {
    const mockOrganisationService = {
      getPrimaryOrganisationsForUser: jest
        .fn()
        .mockReturnValue(Promise.resolve()),
      addUserToOrganisation: jest.fn().mockReturnValue(Promise.resolve()),
      createOrganisation: jest.fn().mockReturnValue(Promise.resolve()),
      leaveOrganisation: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganisationController],
      providers: [
        {
          provide: OrganisationService,
          useValue: mockOrganisationService,
        },
      ],
    }).compile();

    controller = module.get<OrganisationController>(OrganisationController);
    service = module.get(OrganisationService);

    // Mock Logger to prevent console output during tests
    jest.spyOn(Logger, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger, 'warn').mockImplementation(() => undefined);
  });

  describe('getOrganisationsForUser', () => {
    it('should return the organisation', async () => {
      const result = await controller.getOrganisationsForUser([
        mockUser,
        mockOrganisation,
      ]);
      expect(result).toBe(mockOrganisation);
    });
  });

  describe('joinOrganisation', () => {
    it('should throw if user already has an organisation', async () => {
      await expect(
        controller.joinOrganisation([mockUser, mockOrganisation], {
          inviteCode: 'invite-123',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should join organisation with valid invite code', async () => {
      service.getPrimaryOrganisationsForUser.mockResolvedValue(
        mockOrganisation,
      );

      const result = await controller.joinOrganisation([mockUser, null], {
        inviteCode: 'invite-123',
      });

      expect(service.addUserToOrganisation).toHaveBeenCalledWith(
        mockUser,
        'invite-123',
      );
      expect(result).toBe(mockOrganisation);
    });
  });

  describe('createOrganisation', () => {
    it('should throw if user not found', async () => {
      await expect(
        controller.createOrganisation([null, null], { name: 'Test Org' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if user already has an organisation', async () => {
      await expect(
        controller.createOrganisation([mockUser, mockOrganisation], {
          name: 'Test Org',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should create organisation successfully', async () => {
      service.createOrganisation.mockResolvedValue(mockOrganisation);

      const result = await controller.createOrganisation([mockUser, null], {
        name: 'Test Org',
      });

      expect(service.createOrganisation).toHaveBeenCalledWith(
        'Test Org',
        mockUser,
      );
      expect(result).toBe(mockOrganisation);
    });
  });

  describe('leaveOrganisation', () => {
    it('should leave organisation successfully', async () => {
      const result = await controller.leaveOrganisation([
        mockUser,
        mockOrganisation,
      ]);

      expect(service.leaveOrganisation).toHaveBeenCalledWith(
        mockUser,
        mockOrganisation,
      );
      expect(result).toEqual({});
    });
  });
});
