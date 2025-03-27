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
    dto: CreateVehicleRentalDto,
    organisationId: string,
  ): Promise<any> {
    // Prüfen, ob Fahrzeug zur Organisation gehört und verfügbar ist
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: dto.vehicleId,
        organisationId,
        status: 'available',
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or not available');
    }

    // Prüfen, ob der Benutzer zur Organisation gehört
    const isMember = await this.prisma.organisationMember.findUnique({
      where: {
        organisationId_userId: {
          organisationId,
          userId: dto.userId,
        },
      },
    });

    if (!isMember) {
      throw new BadRequestException(
        'User is not a member of this organisation',
      );
    }

    // Prüfen, ob es überlappende Reservierungen gibt
    const plannedStart = new Date(dto.plannedStart);
    const plannedEnd = new Date(dto.plannedEnd);

    if (plannedStart >= plannedEnd) {
      throw new BadRequestException('Start date must be before end date');
    }

    const overlappingRentals = await this.prisma.vehicleRental.findMany({
      where: {
        vehicleId: dto.vehicleId,
        status: { in: ['active', 'planned'] },
        OR: [
          {
            AND: [
              { plannedStart: { lte: plannedStart } },
              { plannedEnd: { gte: plannedStart } },
            ],
          },
          {
            AND: [
              { plannedStart: { lte: plannedEnd } },
              { plannedEnd: { gte: plannedEnd } },
            ],
          },
          {
            AND: [
              { plannedStart: { gte: plannedStart } },
              { plannedEnd: { lte: plannedEnd } },
            ],
          },
        ],
      },
    });

    if (overlappingRentals.length > 0) {
      throw new BadRequestException(
        'Vehicle already has an overlapping rental',
      );
    }

    // Status des Fahrzeugs aktualisieren, wenn die Ausleihe jetzt beginnt
    const now = new Date();
    const status =
      plannedStart <= now && plannedEnd >= now ? 'active' : 'planned';

    // Wenn die Ausleihe aktiv ist, muss das Fahrzeug auf "rented" gesetzt werden
    if (status === 'active') {
      await this.prisma.vehicle.update({
        where: { id: dto.vehicleId },
        data: { status: 'rented' },
      });
    }

    // Ausleihe erstellen
    return this.prisma.vehicleRental.create({
      data: {
        vehicleId: dto.vehicleId,
        userId: dto.userId,
        purpose: dto.purpose,
        plannedStart,
        plannedEnd,
        status,
      },
      include: {
        vehicle: true,
      },
    });
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

    // Wenn die Ausleihe aktiv war, Fahrzeug wieder auf "available" setzen
    if (rental.status === 'active') {
      await this.prisma.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: 'available' },
      });
    }

    // Ausleihe stornieren
    return this.prisma.vehicleRental.update({
      where: { id },
      data: { status: 'canceled' },
      include: {
        vehicle: true,
      },
    });
  }
}
