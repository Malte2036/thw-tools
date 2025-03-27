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
import { EnsureUserAndOrgGuard } from '../shared/user-org/ensure-user-org.guard';
import { Request } from 'express';

@Controller('vehicles')
@UseGuards(EnsureUserAndOrgGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async getAllVehiclesForOrganisation(@Req() req: Request): Promise<any> {
    // Organisation-ID aus dem Request (wurde von Middleware hinzugefügt)
    const organisationId = req.organisation.id;
    return this.vehiclesService.findAllVehiclesForOrganisation(organisationId);
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
    return this.vehiclesService.createRental(dto, organisationId, userId);
  }

  @Put('rentals/:id/cancel')
  async cancelRental(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const organisationId = req.organisation.id;
    return this.vehiclesService.cancelRental(id, organisationId);
  }
}
