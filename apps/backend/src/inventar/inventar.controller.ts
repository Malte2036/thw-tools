import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InventarService } from './inventar.service';

@Controller('inventar')
export class InventarController {
  constructor(private readonly inventarService: InventarService) {}

  @Get()
  async getInventar() {
    return this.inventarService.getInventarItems();
  }

  @Post()
  async createInventarItem(
    @Body() body: { deviceId: string; isUsed: boolean },
  ) {
    const { deviceId, isUsed } = body;

    Logger.log(`Creating inventar item with deviceId ${deviceId} to ${isUsed}`);
    if (!deviceId) {
      throw new HttpException('Invalid deviceId', HttpStatus.BAD_REQUEST);
    }

    return this.inventarService.createInventarItem(deviceId, isUsed);
  }

  @Put(':deviceId')
  async updatenventarItem(
    @Param('deviceId') deviceId: string,
    @Body()
    body: {
      isUsed: boolean;
    },
  ) {
    Logger.log(
      `Updating inventar item with deviceId ${deviceId} to ${body.isUsed}`,
    );
    if (!deviceId) {
      throw new HttpException('Invalid deviceId', HttpStatus.BAD_REQUEST);
    }

    if (body.isUsed === undefined) {
      throw new HttpException('Invalid isUsed value', HttpStatus.BAD_REQUEST);
    }

    const res = await this.inventarService.updateInventarItem(
      deviceId,
      body.isUsed,
    );
    if (res.matchedCount === 0) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }
  }
}
