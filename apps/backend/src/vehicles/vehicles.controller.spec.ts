import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleRentalDto } from './dto/create-vehicle-rental.dto';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const mockVehiclesService = {
    findAllVehiclesForOrganisation: jest.fn(),
    findAllRentalsForOrganisation: jest.fn(),
    createRental: jest.fn(),
    cancelRental: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllVehiclesForOrganisation', () => {
    it('should return all vehicles for an organisation', async () => {
      const mockVehicles = [
        { id: '1', licensePlate: 'THW-123' },
        { id: '2', licensePlate: 'THW-456' },
      ];
      const mockRequest = {
        organisation: { id: 'org-id' },
      };

      mockVehiclesService.findAllVehiclesForOrganisation.mockResolvedValue(
        mockVehicles,
      );

      const result = await controller.getAllVehiclesForOrganisation(
        mockRequest as any,
      );

      expect(result).toBe(mockVehicles);
      expect(
        mockVehiclesService.findAllVehiclesForOrganisation,
      ).toHaveBeenCalledWith('org-id');
    });
  });

  describe('getAllRentalsForOrganisation', () => {
    it('should return all rentals for an organisation', async () => {
      const mockRentals = [
        { id: '1', vehicleId: 'v1', userId: 'u1', status: 'planned' },
        { id: '2', vehicleId: 'v2', userId: 'u2', status: 'active' },
      ];
      const mockRequest = {
        organisation: { id: 'org-id' },
      };

      mockVehiclesService.findAllRentalsForOrganisation.mockResolvedValue(
        mockRentals,
      );

      const result = await controller.getAllRentalsForOrganisation(
        mockRequest as any,
      );

      expect(result).toBe(mockRentals);
      expect(
        mockVehiclesService.findAllRentalsForOrganisation,
      ).toHaveBeenCalledWith('org-id');
    });
  });

  describe('createRental', () => {
    it('should create a new rental', async () => {
      const dto: CreateVehicleRentalDto = {
        vehicleId: 'v1',
        purpose: 'Test purpose',
        plannedStart: '2023-06-15T08:00:00Z',
        plannedEnd: '2023-06-15T18:00:00Z',
      };
      const mockRental = {
        id: 'r1',
        ...dto,
        userId: 'u1',
        status: 'planned',
      };
      const mockRequest = {
        organisation: { id: 'org-id' },
        user: { id: 'u1' },
      };

      mockVehiclesService.createRental.mockResolvedValue(mockRental);

      const result = await controller.createRental(dto, mockRequest as any);

      expect(result).toBe(mockRental);
      expect(mockVehiclesService.createRental).toHaveBeenCalledWith(
        dto,
        'org-id',
        'u1',
      );
    });

    it('should forward exceptions from the service', async () => {
      const dto: CreateVehicleRentalDto = {
        vehicleId: 'v1',
        purpose: 'Test purpose',
        plannedStart: '2023-06-15T08:00:00Z',
        plannedEnd: '2023-06-15T18:00:00Z',
      };
      const mockRequest = {
        organisation: { id: 'org-id' },
        user: { id: 'u1' },
      };

      const error = new Error('Service error');
      mockVehiclesService.createRental.mockRejectedValue(error);

      await expect(
        controller.createRental(dto, mockRequest as any),
      ).rejects.toThrow(error);
    });
  });

  describe('cancelRental', () => {
    it('should cancel a rental', async () => {
      const rentalId = 'r1';
      const mockRental = {
        id: rentalId,
        status: 'canceled',
      };
      const mockRequest = {
        organisation: { id: 'org-id' },
      };

      mockVehiclesService.cancelRental.mockResolvedValue(mockRental);

      const result = await controller.cancelRental(
        rentalId,
        mockRequest as any,
      );

      expect(result).toBe(mockRental);
      expect(mockVehiclesService.cancelRental).toHaveBeenCalledWith(
        rentalId,
        'org-id',
      );
    });

    it('should forward exceptions from the service when canceling a rental', async () => {
      const rentalId = 'non-existent';
      const mockRequest = {
        organisation: { id: 'org-id' },
      };

      const error = new Error('Rental not found');
      mockVehiclesService.cancelRental.mockRejectedValue(error);

      await expect(
        controller.cancelRental(rentalId, mockRequest as any),
      ).rejects.toThrow(error);
    });
  });
});
