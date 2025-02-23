import { Test, TestingModule } from '@nestjs/testing';
import { FunkController } from './funk.controller';
import { FunkService } from './funk.service';
import { HttpException, Logger } from '@nestjs/common';
import {
  User,
  Organisation,
  FunkItem,
  FunkItemEvent,
  FunkItemEventType,
  FunkItemEventBulk,
} from '@prisma/client';

describe('FunkController', () => {
  let controller: FunkController;
  let funkService: jest.Mocked<FunkService>;

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

  const mockEventBulks: (FunkItemEventBulk & {
    events: { event: FunkItemEvent; bulkId: string; eventId: string }[];
  })[] = [
    {
      id: '1',
      date: new Date(),
      eventType: FunkItemEventType.borrowed,
      batteryCount: 2,
      organisationId: mockOrganisation.id,
      userId: mockUser.id,
      events: [
        {
          event: mockFunkEvents[0],
          bulkId: '1',
          eventId: mockFunkEvents[0].id,
        },
        {
          event: mockFunkEvents[1],
          bulkId: '1',
          eventId: mockFunkEvents[1].id,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const mockFunkService = {
      getFunkItems: jest.fn(),
      bulkCreateFunkItemEvents: jest.fn(),
      getFunkItemByDeviceId: jest.fn(),
      getFunkItemEvents: jest.fn(),
      getFunkItemEventBulks: jest.fn(),
      exportFunkItemEventBulksAsCsv: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunkController],
      providers: [
        {
          provide: FunkService,
          useValue: mockFunkService,
        },
      ],
    }).compile();

    controller = module.get<FunkController>(FunkController);
    funkService = module.get(FunkService);
  });

  describe('getFunkItems', () => {
    it('should return funk items for organisation', async () => {
      funkService.getFunkItems.mockResolvedValue(mockFunkItems);

      const result = await controller.getFunkItems([
        mockUser,
        mockOrganisation,
      ]);

      expect(result).toEqual(mockFunkItems);
      expect(funkService.getFunkItems).toHaveBeenCalledWith(
        mockOrganisation.id,
      );
    });
  });

  describe('bulkCreateFunkItemEvents', () => {
    const mockEventData = {
      deviceIds: ['device-1', 'device-2'],
      batteryCount: 2,
      eventType: FunkItemEventType.borrowed,
    };

    it('should create bulk funk item events', async () => {
      jest.spyOn(Logger, 'log').mockImplementation();
      funkService.bulkCreateFunkItemEvents.mockResolvedValue();

      await controller.bulkCreateFunkItemEvents(mockEventData, [
        mockUser,
        mockOrganisation,
      ]);

      expect(funkService.bulkCreateFunkItemEvents).toHaveBeenCalledWith(
        mockEventData,
        mockUser,
        mockOrganisation,
        expect.any(Date),
      );
    });

    it('should throw BadRequest for invalid body', async () => {
      jest.spyOn(Logger, 'warn').mockImplementation();

      const invalidData = {
        deviceIds: [],
        batteryCount: 2,
        eventType: FunkItemEventType.borrowed,
      };

      await expect(
        controller.bulkCreateFunkItemEvents(invalidData, [
          mockUser,
          mockOrganisation,
        ]),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getFunkItemEvents', () => {
    const deviceId = 'device-1';
    const mockFunkItem = mockFunkItems[0];

    it('should return events for valid device', async () => {
      funkService.getFunkItemByDeviceId.mockResolvedValue(mockFunkItem);
      funkService.getFunkItemEvents.mockResolvedValue(mockFunkEvents);

      const result = await controller.getFunkItemEvents(deviceId, [
        mockUser,
        mockOrganisation,
      ]);

      expect(result).toEqual(mockFunkEvents);
      expect(funkService.getFunkItemByDeviceId).toHaveBeenCalledWith(
        mockOrganisation.id,
        deviceId,
      );
    });

    it('should throw NotFound for invalid device', async () => {
      funkService.getFunkItemByDeviceId.mockResolvedValue(null);

      await expect(
        controller.getFunkItemEvents(deviceId, [mockUser, mockOrganisation]),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getFunkItemEventBulks', () => {
    it('should return event bulks for organisation', async () => {
      funkService.getFunkItemEventBulks.mockResolvedValue(mockEventBulks);

      const result = await controller.getFunkItemEventBulks([
        mockUser,
        mockOrganisation,
      ]);

      expect(result).toEqual(mockEventBulks);
      expect(funkService.getFunkItemEventBulks).toHaveBeenCalledWith(
        mockOrganisation.id,
      );
    });
  });

  describe('exportFunkItemEventBulksAsCsv', () => {
    const mockCsvData =
      'date,eventType,batteryCount,user,deviceIds\n2024-01-01T00:00:00.000Z,borrowed,2,"Test User (test@example.com)","device-1, device-2"';

    it('should return CSV data for event bulks', async () => {
      funkService.exportFunkItemEventBulksAsCsv.mockResolvedValue(mockCsvData);

      const result = await controller.exportFunkItemEventBulksAsCsv([
        mockUser,
        mockOrganisation,
      ]);

      expect(result).toBe(mockCsvData);
      expect(funkService.exportFunkItemEventBulksAsCsv).toHaveBeenCalledWith(
        mockOrganisation.id,
      );
    });
  });
});
