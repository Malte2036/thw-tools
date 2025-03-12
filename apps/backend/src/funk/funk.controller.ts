import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FunkItemEventType, Organisation, User } from '@prisma/client';
import { Request } from 'express';
import { FunkService } from './funk.service';
import { EnsureUserAndOrgGuard } from '../shared/user-org/ensure-user-org.guard';

@ApiTags('funk')
@Controller('funk')
export class FunkController {
  constructor(private readonly funkService: FunkService) {}

  @Get()
  @UseGuards(EnsureUserAndOrgGuard)
  async findAll(@Req() req: Request) {
    Logger.log('Getting funk items');
    return this.funkService.getFunkItems(req.organisation.id);
  }

  @Post('events/bulk')
  @UseGuards(EnsureUserAndOrgGuard)
  async bulkCreateFunkItemEvents(
    @Req() req: Request,
    @Body()
    body: {
      deviceIds: string[];
      batteryCount: number;
      eventType: FunkItemEventType;
    },
  ) {
    Logger.log(
      `Bulk creating funk item events with type ${body.eventType} for devices ${body.deviceIds.join(', ')}`,
    );

    if (
      !body ||
      !Array.isArray(body.deviceIds) ||
      body.deviceIds.length === 0 ||
      !body.eventType
    ) {
      Logger.warn('Invalid body', body);
      throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
    }

    await this.funkService.bulkCreateFunkItemEvents(
      body,
      req.user,
      req.organisation,
      new Date(),
    );

    return {};
  }

  @Get(':deviceId/events')
  @UseGuards(EnsureUserAndOrgGuard)
  async getFunkItemEvents(
    @Req() req: Request,
    @Param('deviceId') deviceId: string,
  ) {
    const item = await this.funkService.getFunkItemByDeviceId(
      req.organisation.id,
      deviceId,
    );
    if (!item) {
      throw new HttpException('Funk item not found', HttpStatus.NOT_FOUND);
    }

    return this.funkService.getFunkItemEvents(item);
  }

  @Get('events/bulk')
  @UseGuards(EnsureUserAndOrgGuard)
  async getFunkItemEventBulks(@Req() req: Request) {
    return this.funkService.getFunkItemEventBulks(req.organisation.id);
  }

  @Get('events/bulk/export')
  @UseGuards(EnsureUserAndOrgGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="funk_item_events.csv"')
  async exportFunkItemEventBulksAsCsv(@Req() req: Request) {
    const csvData = await this.funkService.exportFunkItemEventBulksAsCsv(
      req.organisation.id,
    );

    return csvData;
  }
}
