import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateVehicleRentalDto } from './dto/create-vehicle-rental.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma Service
const mockPrismaService = mockDeep<PrismaService>();

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get(PrismaService);

    // Clear all mock info
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllVehiclesForOrganisation', () => {
    it('should return all vehicles for an organisation', async () => {
      // Given
      const organisationId = 'org-123';
      const mockVehicles = [
        {
          id: 'vehicle-1',
          licensePlate: 'THW-001',
          vehicleType: 'MTW',
          radioCallName: 'THW 83/01',
          unit: 'Bergung',
          organisationId,
          rentals: [],
        },
      ];

      prisma.vehicle.findMany.mockResolvedValue(mockVehicles);

      // When
      const result =
        await service.findAllVehiclesForOrganisation(organisationId);

      // Then
      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: { organisationId },
        include: {
          rentals: {
            where: {
              status: 'active',
            },
          },
        },
      });
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle successfully', async () => {
      // Given
      const organisationId = 'org-123';
      const createVehicleDto: CreateVehicleDto = {
        licensePlate: 'THW-001',
        vehicleType: 'MTW',
        radioCallName: 'THW 83/01',
        unit: 'Bergung',
      };

      const mockOrganisation = {
        id: organisationId,
        name: 'THW OV Test',
        inviteCode: 'ABCDEF',
      };

      const mockCreatedVehicle = {
        id: 'vehicle-1',
        ...createVehicleDto,
        organisationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.organisation.findUnique.mockResolvedValue(mockOrganisation);
      prisma.vehicle.findFirst.mockResolvedValue(null); // No existing vehicle
      prisma.vehicle.create.mockResolvedValue(mockCreatedVehicle);

      // When
      const result = await service.createVehicle(
        createVehicleDto,
        organisationId,
      );

      // Then
      expect(result).toEqual(mockCreatedVehicle);
      expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(prisma.vehicle.findFirst).toHaveBeenCalledWith({
        where: {
          licensePlate: createVehicleDto.licensePlate,
          organisationId,
        },
      });
      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: {
          ...createVehicleDto,
          organisationId,
        },
      });
    });

    it('should throw NotFoundException when organisation does not exist', async () => {
      // Given
      const organisationId = 'org-123';
      const createVehicleDto: CreateVehicleDto = {
        licensePlate: 'THW-001',
        vehicleType: 'MTW',
        radioCallName: 'THW 83/01',
        unit: 'Bergung',
      };

      prisma.organisation.findUnique.mockResolvedValue(null); // Organisation not found

      // When & Then
      await expect(
        service.createVehicle(createVehicleDto, organisationId),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(prisma.vehicle.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when vehicle with same license plate already exists', async () => {
      // Given
      const organisationId = 'org-123';
      const createVehicleDto: CreateVehicleDto = {
        licensePlate: 'THW-001',
        vehicleType: 'MTW',
        radioCallName: 'THW 83/01',
        unit: 'Bergung',
      };

      const mockOrganisation = {
        id: organisationId,
        name: 'THW OV Test',
        inviteCode: 'ABCDEF',
      };

      const existingVehicle = {
        id: 'vehicle-1',
        licensePlate: 'THW-001',
        vehicleType: 'GKW',
        radioCallName: 'THW 83/02',
        unit: 'Bergung',
        organisationId,
      };

      prisma.organisation.findUnique.mockResolvedValue(mockOrganisation);
      prisma.vehicle.findFirst.mockResolvedValue(existingVehicle); // Vehicle with same license plate exists

      // When & Then
      await expect(
        service.createVehicle(createVehicleDto, organisationId),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(prisma.vehicle.findFirst).toHaveBeenCalledWith({
        where: {
          licensePlate: createVehicleDto.licensePlate,
          organisationId,
        },
      });
      expect(prisma.vehicle.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllRentalsForOrganisation', () => {
    // ... existing tests ...
  });

  describe('createRental', () => {
    const createRentalDto = {
      vehicleId: 'vehicle-id',
      purpose: 'Test purpose',
      plannedStart: '2023-06-15T08:00:00Z',
      plannedEnd: '2023-06-15T18:00:00Z',
    };

    const userId = 'user-id';

    const mockVehicle = {
      id: 'vehicle-id',
      organisationId: 'org-id',
      rentals: [],
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
        userId,
        status: 'planned',
      });
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      mockPrismaService.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.createRental(createRentalDto, 'org-id', userId),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.vehicle.findFirst).toHaveBeenCalledWith({
        where: {
          id: createRentalDto.vehicleId,
          organisationId: 'org-id',
        },
        include: {
          rentals: {
            where: {
              status: 'active',
            },
          },
        },
      });
    });

    it('should NOT throw BadRequestException when vehicle has active rentals but not overlapping', async () => {
      mockPrismaService.vehicle.findFirst.mockResolvedValue({
        ...mockVehicle,
        rentals: [{ id: 'active-rental', status: 'active' }],
      });

      // Mock no overlapping rentals
      mockPrismaService.vehicleRental.findMany.mockResolvedValue([]);

      // Mock successful rental creation
      mockPrismaService.vehicleRental.create.mockResolvedValue({
        id: 'rental-id',
        ...createRentalDto,
        userId,
        status: 'planned',
      });

      // This should not throw an exception now
      const result = await service.createRental(
        createRentalDto,
        'org-id',
        userId,
      );
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when user is not a member of the organisation', async () => {
      mockPrismaService.organisationMember.findUnique.mockResolvedValue(null);

      await expect(
        service.createRental(createRentalDto, 'org-id', userId),
      ).rejects.toThrow(BadRequestException);

      expect(
        mockPrismaService.organisationMember.findUnique,
      ).toHaveBeenCalledWith({
        where: {
          organisationId_userId: {
            organisationId: 'org-id',
            userId,
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

      await expect(
        service.createRental(invalidDto, 'org-id', userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when there are overlapping rentals', async () => {
      mockPrismaService.vehicleRental.findMany.mockResolvedValue([
        {
          id: 'existing-rental',
          vehicleId: 'vehicle-id',
          status: 'active',
          plannedStart: new Date('2023-06-15T07:00:00Z'),
          plannedEnd: new Date('2023-06-15T10:00:00Z'),
        },
      ]);

      await expect(
        service.createRental(createRentalDto, 'org-id', userId),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.vehicleRental.findMany).toHaveBeenCalled();
    });

    it('should create active rental successfully', async () => {
      // Set future dates
      const futureDto = {
        ...createRentalDto,
        plannedStart: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        plannedEnd: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      };

      mockPrismaService.vehicleRental.create.mockResolvedValue({
        id: 'rental-id',
        ...futureDto,
        userId,
        status: 'active',
      });

      const result = await service.createRental(futureDto, 'org-id', userId);

      expect(result).toBeDefined();
      expect(mockPrismaService.vehicleRental.create).toHaveBeenCalled();
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled();
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

    it('should cancel an active rental without updating vehicle status', async () => {
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
      // Kein vehicle.update mehr
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled();
      expect(mockPrismaService.vehicleRental.update).toHaveBeenCalledWith({
        where: { id: 'rental-id' },
        data: { status: 'canceled' },
        include: { vehicle: true },
      });
    });

    it('should cancel a planned rental', async () => {
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
      expect(mockPrismaService.vehicle.update).not.toHaveBeenCalled();
      expect(mockPrismaService.vehicleRental.update).toHaveBeenCalledWith({
        where: { id: 'rental-id' },
        data: { status: 'canceled' },
        include: { vehicle: true },
      });
    });
  });
});
