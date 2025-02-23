import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { Logger, HttpException } from '@nestjs/common';
import type { User, Organisation, OrganisationMember } from '@prisma/client';
import { createMockRequest } from '../test/mock-request.helper';

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
        .mockResolvedValue(mockOrganisation),
      addUserToOrganisation: jest.fn().mockResolvedValue(undefined),
      createOrganisation: jest.fn().mockResolvedValue(mockOrganisation),
      leaveOrganisation: jest.fn().mockResolvedValue(undefined),
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

  it('should return organisation for authenticated user', async () => {
    const mockRequest = createMockRequest({
      user: mockUser as User,
      organisation: mockOrganisation as Organisation,
    });

    const result = await controller.getOrganisationsForUser(mockRequest);
    expect(result).toBe(mockOrganisation);
  });

  it('should handle joining an organisation', async () => {
    const mockRequest = createMockRequest({
      user: mockUser,
      organisation: null,
    });

    await controller.joinOrganisation(mockRequest, { inviteCode: 'test-code' });

    expect(service.addUserToOrganisation).toHaveBeenCalledWith(
      mockUser,
      'test-code',
    );
  });

  it('should prevent joining when already in organisation', async () => {
    const mockRequest = createMockRequest({
      user: mockUser,
      organisation: mockOrganisation,
    });

    await expect(
      controller.joinOrganisation(mockRequest, { inviteCode: 'test-code' }),
    ).rejects.toThrow(HttpException);
  });

  it('should handle creating an organisation', async () => {
    const mockRequest = createMockRequest({
      user: mockUser,
      organisation: null,
    });

    const result = await controller.createOrganisation(mockRequest, {
      name: 'Test Org',
    });

    expect(service.createOrganisation).toHaveBeenCalledWith(
      'Test Org',
      mockUser,
    );
    expect(result).toBe(mockOrganisation);
  });

  it('should prevent creating when already in organisation', async () => {
    const mockRequest = createMockRequest({
      user: mockUser,
      organisation: mockOrganisation,
    });

    await expect(
      controller.createOrganisation(mockRequest, { name: 'Test Org' }),
    ).rejects.toThrow(HttpException);
  });

  it('should handle leaving an organisation', async () => {
    const mockRequest = createMockRequest({
      user: mockUser,
      organisation: mockOrganisation,
    });

    const result = await controller.leaveOrganisation(mockRequest);

    expect(service.leaveOrganisation).toHaveBeenCalledWith(
      mockUser,
      mockOrganisation,
    );
    expect(result).toEqual({});
  });
});
