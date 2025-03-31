import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleRentalDto } from './dto/create-vehicle-rental.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { EmailService } from '../email/email.service';
import {
  getRentalConfirmationEmail,
  getRentalCancellationEmail,
} from '../email/templates/vehicle-emails';
import { Vehicle, VehicleRental } from '@prisma/client';
@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Fahrzeuge für eine Organisation abrufen
  async findAllVehiclesForOrganisation(
    organisationId: string,
  ): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { organisationId },
    });
  }

  // Neues Fahrzeug erstellen
  async createVehicle(
    createVehicleDto: CreateVehicleDto,
    organisationId: string,
  ): Promise<Vehicle> {
    // Prüfen, ob die Organisation existiert
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }

    // Prüfen, ob ein Fahrzeug mit gleichem Kennzeichen bereits existiert
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: {
        licensePlate: createVehicleDto.licensePlate,
        organisationId,
      },
    });

    if (existingVehicle) {
      throw new BadRequestException(
        'A vehicle with this license plate already exists in your organisation',
      );
    }

    // Fahrzeug erstellen
    const vehicle = await this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        organisationId,
      },
    });

    return vehicle;
  }

  // Alle Ausleihen für eine Organisation abrufen
  async findAllRentalsForOrganisation(
    organisationId: string,
  ): Promise<VehicleRental[]> {
    return this.prisma.vehicleRental.findMany({
      where: {
        vehicle: {
          organisationId,
        },
      },
    });
  }

  // Neue Ausleihe erstellen
  async createRental(
    createVehicleRentalDto: CreateVehicleRentalDto,
    organisationId: string,
    userId: string,
  ): Promise<VehicleRental> {
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
      include: {
        user: true,
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

    this.logger.log(
      `Successfully created rental ${rental.id} for vehicle ${vehicle.id}`,
    );

    // Send confirmation email to the user
    try {
      await this.emailService.sendEmail(
        getRentalConfirmationEmail({
          vehicle,
          user: orgMember.user,
          rental: {
            purpose: createVehicleRentalDto.purpose,
            plannedStart,
            plannedEnd,
          },
        }),
      );
    } catch (error: any) {
      // Log the detailed error for debugging
      this.logger.error('Failed to send rental confirmation email:', {
        error: error.message,
        userId: orgMember.user.id,
        email: orgMember.user.email,
        vehicleId: vehicle.id,
        rentalId: rental.id,
      });

      // Don't throw the error as the rental was still created successfully
      return rental;
    }

    return rental;
  }

  // Ausleihe stornieren
  async cancelRental(
    id: string,
    organisationId: string,
  ): Promise<VehicleRental> {
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
        user: true,
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
        user: true,
      },
    });

    this.logger.log(
      `Successfully canceled rental ${rental.id} for vehicle ${rental.vehicle.id}`,
    );

    // Send cancellation email to the user
    try {
      await this.emailService.sendEmail(
        getRentalCancellationEmail({
          vehicle: rental.vehicle,
          user: rental.user,
          rental: {
            purpose: rental.purpose,
            plannedStart: rental.plannedStart,
            plannedEnd: rental.plannedEnd,
          },
        }),
      );
    } catch (error: any) {
      // Log the detailed error for debugging
      this.logger.error('Failed to send rental cancellation email:', {
        error: error.message,
        userId: rental.user.id,
        email: rental.user.email,
        vehicleId: rental.vehicle.id,
        rentalId: rental.id,
      });
    }

    return updatedRental;
  }
}
