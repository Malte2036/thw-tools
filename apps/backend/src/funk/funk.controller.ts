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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FunkItemEventType, Organisation, User } from '@prisma/client';
import { Request } from 'express';
import { FunkService } from './funk.service';
import { GetUserAndOrgOrThrow } from '../shared/user-org/user-org.decorator';

@ApiTags('funk')
@Controller('funk')
export class FunkController {
  constructor(private readonly funkService: FunkService) {}

  @Get()
  async getFunkItems(
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ) {
    return this.funkService.getFunkItems(organisation.id);
  }

  @Post('events/bulk')
  async bulkCreateFunkItemEvents(
    @Body()
    body: {
      deviceIds: string[];
      batteryCount: number;
      eventType: FunkItemEventType;
    },
    @GetUserAndOrgOrThrow() [user, organisation]: [User, Organisation],
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
      user,
      organisation,
      new Date(),
    );

    return {};
  }

  @Get(':deviceId/events')
  async getFunkItemEvents(
    @Param('deviceId') deviceId: string,
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ) {
    const item = await this.funkService.getFunkItemByDeviceId(
      organisation.id,
      deviceId,
    );
    if (!item) {
      throw new HttpException('Funk item not found', HttpStatus.NOT_FOUND);
    }

    return this.funkService.getFunkItemEvents(item);
  }

  @Get('events/bulk')
  async getFunkItemEventBulks(
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ) {
    return this.funkService.getFunkItemEventBulks(organisation.id);
  }

  @Get('events/bulk/export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="funk_item_events.csv"')
  async exportFunkItemEventBulksAsCsv(
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ) {
    const csvData = await this.funkService.exportFunkItemEventBulksAsCsv(
      organisation.id,
    );

    return csvData;
  }
}
