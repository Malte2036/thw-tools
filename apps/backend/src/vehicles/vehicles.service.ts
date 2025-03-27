import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleRentalDto } from './dto/create-vehicle-rental.dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private prisma: PrismaService) {}

  // Fahrzeuge für eine Organisation abrufen
  async findAllVehiclesForOrganisation(organisationId: string): Promise<any> {
    return this.prisma.vehicle.findMany({
      where: { organisationId },
      include: {
        rentals: {
          where: {
            status: 'active',
          },
        },
      },
    });
  }

  // Alle Ausleihen für eine Organisation abrufen
  async findAllRentalsForOrganisation(organisationId: string): Promise<any> {
    return this.prisma.vehicleRental.findMany({
      where: {
        vehicle: {
          organisationId,
        },
      },
      include: {
        vehicle: true,
      },
    });
  }

  // Neue Ausleihe erstellen
  async createRental(
    createVehicleRentalDto: CreateVehicleRentalDto,
    organisationId: string,
    userId: string,
  ): Promise<any> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: createVehicleRentalDto.vehicleId,
        organisationId,
      },
      include: {
        rentals: {
          where: {
            status: 'active',
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in your organisation');
    }

    // Check if user is part of the organisation
    const orgMember = await this.prisma.organisationMember.findUnique({
      where: {
        organisationId_userId: {
          organisationId,
          userId,
        },
      },
    });

    if (!orgMember) {
      throw new BadRequestException('User is not a member of the organisation');
    }

    // Prüfen, ob es überlappende Reservierungen gibt
    const plannedStart = new Date(createVehicleRentalDto.plannedStart);
    const plannedEnd = new Date(createVehicleRentalDto.plannedEnd);

    if (plannedStart >= plannedEnd) {
      throw new BadRequestException('Start date must be before end date');
    }

    const overlappingRentals = await this.prisma.vehicleRental.findMany({
      where: {
        vehicleId: createVehicleRentalDto.vehicleId,
        status: 'active',
        OR: [
          {
            // Fall 1: Start innerhalb einer existierenden Reservierung
            plannedStart: {
              lte: plannedEnd,
            },
            plannedEnd: {
              gte: plannedStart,
            },
          },
        ],
      },
    });

    if (overlappingRentals.length > 0) {
      throw new BadRequestException(
        'There are overlapping rentals for this vehicle',
      );
    }

    // Ausleihe erstellen - always active
    const rental = await this.prisma.vehicleRental.create({
      data: {
        vehicleId: createVehicleRentalDto.vehicleId,
        userId,
        purpose: createVehicleRentalDto.purpose,
        plannedStart,
        plannedEnd,
        status: 'active',
      },
      include: {
        vehicle: true,
        user: true,
      },
    });

    return rental;
  }

  // Ausleihe stornieren
  async cancelRental(id: string, organisationId: string): Promise<any> {
    // Prüfen, ob die Ausleihe existiert und zur Organisation gehört
    const rental = await this.prisma.vehicleRental.findFirst({
      where: {
        id,
        vehicle: {
          organisationId,
        },
      },
      include: {
        vehicle: true,
      },
    });

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (rental.status === 'canceled') {
      throw new BadRequestException('Rental is already canceled');
    }

    // Ausleihe stornieren
    const updatedRental = await this.prisma.vehicleRental.update({
      where: {
        id,
      },
      data: {
        status: 'canceled',
      },
      include: {
        vehicle: true,
      },
    });

    return updatedRental;
  }
}
