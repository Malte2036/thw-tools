import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    vehicle: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    vehicleRental: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organisationMember: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllVehiclesForOrganisation', () => {
    it('should return all vehicles for organisation', async () => {
      const mockVehicles = [{ id: '1', licensePlate: 'TEST-123' }];
      mockPrismaService.vehicle.findMany.mockResolvedValue(mockVehicles);

      const result = await service.findAllVehiclesForOrganisation('org-id');

      expect(result).toEqual(mockVehicles);
      expect(mockPrismaService.vehicle.findMany).toHaveBeenCalledWith({
        where: { organisationId: 'org-id' },
      });
    });
  });

  describe('createRental', () => {
    const createRentalDto = {
      vehicleId: 'vehicle-id',
      userId: 'user-id',
      purpose: 'Test purpose',
      plannedStart: '2023-06-15T08:00:00Z',
      plannedEnd: '2023-06-15T18:00:00Z',
    };

    const mockVehicle = {
      id: 'vehicle-id',
      status: 'available',
      organisationId: 'org-id',
    };

    const mockOrganisationMember = {
      userId: 'user-id',
      organisationId: 'org-id',
    };

    beforeEach(() => {
      mockPrismaService.vehicle.findFirst.mockResolvedValue(mockVehicle);
      mockPrismaService.organisationMember.findUnique.mockResolvedValue(
        mockOrganisationMember,
      );
      mockPrismaService.vehicleRental.findMany.mockResolvedValue([]);
      mockPrismaService.vehicleRental.create.mockResolvedValue({
        id: 'rental-id',
        ...createRentalDto,
        status: 'planned',
      });
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      mockPrismaService.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.createRental(createRentalDto, 'org-id'),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.vehicle.findFirst).toHaveBeenCalledWith({
        where: {
          id: createRentalDto.vehicleId,
          organisationId: 'org-id',
          status: 'available',
        },
      });
    });

    it('should throw BadRequestException when user is not a member of the organisation', async () => {
      mockPrismaService.organisationMember.findUnique.mockResolvedValue(null);

      await expect(
        service.createRental(createRentalDto, 'org-id'),
      ).rejects.toThrow(BadRequestException);

      expect(
        mockPrismaService.organisationMember.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          organisationId_userId: {
            organisationId: 'org-id',
            userId: createRentalDto.userId,
          },
        },
      });
    });

    it('should throw BadRequestException when start date is after end date', async () => {
      const invalidDto = {
        ...createRentalDto,
        plannedStart: '2023-06-15T20:00:00Z', // After end date
        plannedEnd: '2023-06-15T18:00:00Z',
      };

      await expect(service.createRental(invalidDto, 'org-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when there are overlapping rentals', async () => {
      mockPrismaService.vehicleRental.findMany.mockResolvedValue([
        {
          id: 'existing-rental',
          vehicleId: 'vehicle-id',
          status: 'planned',
          plannedStart: new Date('2023-06-15T07:00:00Z'),
          plannedEnd: new Date('2023-06-15T10:00:00Z'),
        },
      ]);

      await expect(
        service.createRental(createRentalDto, 'org-id'),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.vehicleRental.findMany).toHaveBeenCalled();
    });

    it('should create planned rental successfully', async () => {
      // Set future dates
      const futureDto = {
        ...createRentalDto,
        plannedStart: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        plannedEnd: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      };

      mockPrismaService.vehicleRental.create.mockResolvedValue({
        id: 'rental-id',
        ...futureDto,
        status: 'planned',
      });

      const result = await service.createRental(futureDto, 'org-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.vehicleRental.create).toHaveBeenCalled();
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled(); // Vehicle status not updated for future rentals
    });

    it('should create active rental and update vehicle status when rental starts now', async () => {
      // Statt die komplette Date-Klasse zu mocken, direkter die DTO-Werte setzen
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 3600000); // 1 Stunde später

      const activeDto = {
        ...createRentalDto,
        plannedStart: now.toISOString(),
        plannedEnd: oneHourLater.toISOString(),
      };

      mockPrismaService.vehicleRental.create.mockResolvedValue({
        id: 'rental-id',
        ...activeDto,
        status: 'active',
      });

      const result = await service.createRental(activeDto, 'org-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: activeDto.vehicleId },
        data: { status: 'rented' },
      });
      expect(mockPrismaService.vehicleRental.create).toHaveBeenCalled();
    });
  });

  describe('cancelRental', () => {
    it('should throw NotFoundException when rental not found', async () => {
      mockPrismaService.vehicleRental.findFirst.mockResolvedValue(null);

      await expect(service.cancelRental('rental-id', 'org-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.vehicleRental.findFirst).toHaveBeenCalled();
    });

    it('should throw BadRequestException when rental already canceled', async () => {
      mockPrismaService.vehicleRental.findFirst.mockResolvedValue({
        id: 'rental-id',
        status: 'canceled',
        vehicleId: 'vehicle-id',
      });

      await expect(service.cancelRental('rental-id', 'org-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should cancel rental and update vehicle status when rental was active', async () => {
      mockPrismaService.vehicleRental.findFirst.mockResolvedValue({
        id: 'rental-id',
        status: 'active',
        vehicleId: 'vehicle-id',
        vehicle: { id: 'vehicle-id' },
      });

      mockPrismaService.vehicleRental.update.mockResolvedValue({
        id: 'rental-id',
        status: 'canceled',
        vehicleId: 'vehicle-id',
      });

      const result = await service.cancelRental('rental-id', 'org-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: 'vehicle-id' },
        data: { status: 'available' },
      });
      expect(mockPrismaService.vehicleRental.update).toHaveBeenCalledWith({
        where: { id: 'rental-id' },
        data: { status: 'canceled' },
        include: { vehicle: true },
      });
    });

    it('should cancel rental but not update vehicle status when rental was planned', async () => {
      mockPrismaService.vehicleRental.findFirst.mockResolvedValue({
        id: 'rental-id',
        status: 'planned',
        vehicleId: 'vehicle-id',
        vehicle: { id: 'vehicle-id' },
      });

      mockPrismaService.vehicleRental.update.mockResolvedValue({
        id: 'rental-id',
        status: 'canceled',
        vehicleId: 'vehicle-id',
      });

      const result = await service.cancelRental('rental-id', 'org-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled(); // Vehicle status shouldn't be updated
      expect(mockPrismaService.vehicleRental.update).toHaveBeenCalledWith({
        where: { id: 'rental-id' },
        data: { status: 'canceled' },
        include: { vehicle: true },
      });
    });
  });
});
