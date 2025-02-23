import { Test, TestingModule } from '@nestjs/testing';
import { FunkService } from './funk.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { prismaMock } from '../prisma/singleton';
import { FunkItemEventType } from '@prisma/client';
import type {
  User,
  Organisation,
  FunkItem,
  FunkItemEvent,
  FunkItemEventBulk,
  Prisma,
} from '@prisma/client';

describe('FunkService', () => {
  let service: FunkService;

  const mockUser: User = {
    id: 'user-1',
    kindeId: 'kinde-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    picture: 'https://example.com/picture.jpg',
  };

  const mockOrganisation: Organisation = {
    id: 'org-1',
    name: 'Test Org',
    inviteCode: 'invite-123',
  };

  const mockFunkItems: FunkItem[] = [
    {
      id: '1',
      deviceId: 'device-1',
      organisationId: mockOrganisation.id,
    },
    {
      id: '2',
      deviceId: 'device-2',
      organisationId: mockOrganisation.id,
    },
  ];

  const mockFunkEvents: FunkItemEvent[] = [
    {
      id: '1',
      type: FunkItemEventType.borrowed,
      date: new Date(),
      funkItemId: mockFunkItems[0].id,
      userId: mockUser.id,
    },
    {
      id: '2',
      type: FunkItemEventType.returned,
      date: new Date(),
      funkItemId: mockFunkItems[0].id,
      userId: mockUser.id,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FunkService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<FunkService>(FunkService);
  });

  describe('getFunkItems', () => {
    it('should return funk items for organisation', async () => {
      prismaMock.funkItem.findMany.mockResolvedValue(mockFunkItems);

      const result = await service.getFunkItems(mockOrganisation.id);

      expect(result).toEqual(mockFunkItems);
      expect(prismaMock.funkItem.findMany).toHaveBeenCalledWith({
        where: { organisationId: mockOrganisation.id },
      });
    });
  });

  describe('getFunkItemByDeviceId', () => {
    it('should return funk item for valid device id', async () => {
      const mockItem = mockFunkItems[0];
      prismaMock.funkItem.findFirst.mockResolvedValue(mockItem);

      const result = await service.getFunkItemByDeviceId(
        mockOrganisation.id,
        mockItem.deviceId,
      );

      expect(result).toEqual(mockItem);
      expect(prismaMock.funkItem.findFirst).toHaveBeenCalledWith({
        where: {
          organisationId: mockOrganisation.id,
          deviceId: mockItem.deviceId,
        },
      });
    });

    it('should return null for non-existent device id', async () => {
      prismaMock.funkItem.findFirst.mockResolvedValue(null);

      const result = await service.getFunkItemByDeviceId(
        mockOrganisation.id,
        'non-existent',
      );

      expect(result).toBeNull();
    });
  });

  describe('createFunkItem', () => {
    const newDeviceId = 'new-device-1';
    const createInput: Prisma.FunkItemCreateInput = {
      deviceId: newDeviceId,
      organisation: {
        connect: {
          id: mockOrganisation.id,
        },
      },
    };

    it('should create new funk item if it does not exist', async () => {
      prismaMock.funkItem.findFirst.mockResolvedValue(null);
      const mockNewItem = { ...mockFunkItems[0], deviceId: newDeviceId };
      prismaMock.funkItem.create.mockResolvedValue(mockNewItem);

      const result = await service.createFunkItem(
        mockOrganisation.id,
        createInput,
      );

      expect(result).toEqual(mockNewItem);
      expect(prismaMock.funkItem.create).toHaveBeenCalledWith({
        data: {
          deviceId: newDeviceId,
          organisationId: mockOrganisation.id,
        },
      });
    });

    it('should return existing item if device id already exists', async () => {
      const existingItem = mockFunkItems[0];
      prismaMock.funkItem.findFirst.mockResolvedValue(existingItem);

      const result = await service.createFunkItem(
        mockOrganisation.id,
        createInput,
      );

      expect(result).toEqual(existingItem);
      expect(prismaMock.funkItem.create).not.toHaveBeenCalled();
    });
  });

  describe('bulkCreateFunkItemEvents', () => {
    const mockDate = new Date('2024-01-01');
    const eventData = {
      deviceIds: ['device-1', 'device-2'],
      batteryCount: 2,
      eventType: FunkItemEventType.borrowed,
    };

    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
    });

    it('should handle non-existent devices by creating them', async () => {
      // Setup mocks for device lookup
      prismaMock.funkItem.findFirst
        .mockResolvedValueOnce(mockFunkItems[0]) // First device exists
        .mockResolvedValueOnce(null); // Second device doesn't exist

      // Setup mock for device creation
      const newItem = {
        id: 'new-1',
        deviceId: 'device-2',
        organisationId: mockOrganisation.id,
      };
      prismaMock.funkItem.create.mockResolvedValueOnce(newItem);

      // Setup mocks for event creation
      prismaMock.funkItemEvent.create
        .mockResolvedValueOnce(mockFunkEvents[0])
        .mockResolvedValueOnce(mockFunkEvents[1]);

      // Setup mock for bulk creation
      prismaMock.funkItemEventBulk.create.mockResolvedValueOnce({
        id: '1',
        date: mockDate,
        eventType: eventData.eventType,
        batteryCount: eventData.batteryCount,
        organisationId: mockOrganisation.id,
        userId: mockUser.id,
      });

      await service.bulkCreateFunkItemEvents(
        eventData,
        mockUser,
        mockOrganisation,
        mockDate,
      );

      // Verify device creation
      expect(prismaMock.funkItem.create).toHaveBeenCalledWith({
        data: {
          deviceId: 'device-2',
          organisationId: mockOrganisation.id,
        },
      });
    });
  });

  describe('exportFunkItemEventBulksAsCsv', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    const mockBulkWithRelations: Prisma.FunkItemEventBulkGetPayload<{
      include: {
        user: true;
        events: {
          include: {
            event: {
              include: {
                funkItem: true;
              };
            };
          };
        };
      };
    }> = {
      id: '1',
      organisationId: mockOrganisation.id,
      userId: mockUser.id,
      date: mockDate,
      eventType: FunkItemEventType.borrowed,
      batteryCount: 2,
      user: mockUser,
      events: [
        {
          bulkId: '1',
          eventId: '1',
          event: {
            id: '1',
            type: FunkItemEventType.borrowed,
            date: mockDate,
            userId: mockUser.id,
            funkItemId: '1',
            funkItem: {
              id: '1',
              deviceId: 'device-1',
              organisationId: mockOrganisation.id,
            },
          },
        },
      ],
    };

    it('should generate CSV from bulk events data', async () => {
      prismaMock.funkItemEventBulk.findMany.mockResolvedValue([
        mockBulkWithRelations,
      ]);

      const result = await service.exportFunkItemEventBulksAsCsv(
        mockOrganisation.id,
      );

      const expectedDate = mockDate.toISOString();
      expect(result).toContain('date,eventType,batteryCount,user,deviceIds');
      expect(result).toContain(
        `${expectedDate},borrowed,2,"Test User (test@example.com)","device-1"`,
      );
      expect(prismaMock.funkItemEventBulk.findMany).toHaveBeenCalledWith({
        where: { organisationId: mockOrganisation.id },
        include: expect.any(Object),
        orderBy: { date: 'desc' },
      });
    });
  });
});
