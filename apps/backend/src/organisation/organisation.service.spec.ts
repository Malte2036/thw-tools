import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationService } from './organisation.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import type { User, Organisation, OrganisationMember } from '@prisma/client';
import { prismaMock } from '../prisma/singleton';

// Add type for mocked org with relations
type MockedOrg = Organisation & {
  members: (OrganisationMember & { user: User })[];
};

describe('OrganisationService', () => {
  let service: OrganisationService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrganisationService>(OrganisationService);
  });

  describe('getPrimaryOrganisationsForUser', () => {
    it('should return the primary organisation for a user', async () => {
      const expectedResult = {
        ...mockOrganisation,
        members: [mockOrgMember],
      };

      prismaMock.organisation.findFirst.mockResolvedValue(expectedResult);

      const result = await service.getPrimaryOrganisationsForUser(mockUser.id);

      expect(result).toEqual(expectedResult);
      expect(prismaMock.organisation.findFirst).toHaveBeenCalledWith({
        where: {
          members: {
            some: {
              userId: mockUser.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    });
  });

  describe('addUserToOrganisation', () => {
    it('should add a user to an organisation with valid invite code', async () => {
      prismaMock.organisation.findUnique.mockResolvedValue({
        ...mockOrganisation,
        members: [],
      } as MockedOrg);

      await service.addUserToOrganisation(mockUser, 'invite-123');

      expect(prismaMock.organisationMember.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          organisationId: mockOrganisation.id,
        },
      });
    });

    it('should throw if invite code is invalid', async () => {
      prismaMock.organisation.findUnique.mockResolvedValue(null);

      await expect(
        service.addUserToOrganisation(mockUser, 'invalid-code'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw if user is already a member', async () => {
      prismaMock.organisation.findUnique.mockResolvedValue({
        ...mockOrganisation,
        members: [mockOrgMember],
      } as MockedOrg);

      await expect(
        service.addUserToOrganisation(mockUser, 'invite-123'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('createOrganisation', () => {
    it('should create a new organisation', async () => {
      const expectedResult = {
        ...mockOrganisation,
        members: [mockOrgMember],
      };

      prismaMock.organisation.create.mockResolvedValue(expectedResult);

      const result = await service.createOrganisation('Test Org', mockUser);

      expect(result).toEqual(expectedResult);
      expect(prismaMock.organisation.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Org',
          inviteCode: expect.any(String),
          members: {
            create: {
              userId: mockUser.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    });
  });

  describe('leaveOrganisation', () => {
    it('should remove user from organisation', async () => {
      await service.leaveOrganisation(mockUser, mockOrganisation);

      expect(prismaMock.organisationMember.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          organisationId: mockOrganisation.id,
        },
      });
    });
  });
});
