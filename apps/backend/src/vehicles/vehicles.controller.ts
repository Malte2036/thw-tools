import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleRentalDto } from './dto/create-vehicle-rental.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { EnsureUserAndOrgGuard } from '../shared/user-org/ensure-user-org.guard';
import { Request } from 'express';
import { EmailService } from '../email/email.service';
import {
  getRentalConfirmationEmail,
  getRentalCancellationEmail,
} from '../email/templates/vehicle-emails';

@Controller('vehicles')
@UseGuards(EnsureUserAndOrgGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async getAllVehiclesForOrganisation(@Req() req: Request): Promise<any> {
    // Organisation-ID aus dem Request (wurde von Middleware hinzugefügt)
    const organisationId = req.organisation.id;
    return this.vehiclesService.findAllVehiclesForOrganisation(organisationId);
  }

  @Post()
  async createVehicle(
    @Body() dto: CreateVehicleDto,
    @Req() req: Request,
  ): Promise<any> {
    const organisationId = req.organisation.id;
    return this.vehiclesService.createVehicle(dto, organisationId);
  }

  @Get('rentals')
  async getAllRentalsForOrganisation(@Req() req: Request): Promise<any> {
    const organisationId = req.organisation.id;
    return this.vehiclesService.findAllRentalsForOrganisation(organisationId);
  }

  @Post('rentals')
  async createRental(
    @Body() dto: CreateVehicleRentalDto,
    @Req() req: Request,
  ): Promise<any> {
    const organisationId = req.organisation.id;
    const userId = req.user.id; // Benutzer-ID aus dem Request
    const { vehicle, rental } = await this.vehiclesService.createRental(
      dto,
      organisationId,
      userId,
    );

    try {
      await this.emailService.sendEmail(
        getRentalConfirmationEmail({
          vehicle,
          user: req.user,
          rental: {
            purpose: rental.purpose,
            plannedStart: rental.plannedStart,
            plannedEnd: rental.plannedEnd,
          },
          orgName: req.organisation.name,
        }),
      );
    } catch (error) {
      // Log but don't throw as rental was created successfully
      console.error('Failed to send rental confirmation email:', error);
    }

    return rental;
  }

  @Put('rentals/:id/cancel')
  async cancelRental(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const organisationId = req.organisation.id;
    const { vehicle, rental } = await this.vehiclesService.cancelRental(
      id,
      organisationId,
    );

    try {
      await this.emailService.sendEmail(
        getRentalCancellationEmail({
          vehicle,
          user: req.user,
          rental: {
            purpose: rental.purpose,
            plannedStart: rental.plannedStart,
            plannedEnd: rental.plannedEnd,
          },
          orgName: req.organisation.name,
        }),
      );
    } catch (error) {
      // Log but don't throw as rental was canceled successfully
      console.error('Failed to send rental cancellation email:', error);
    }

    return rental;
  }
}
