import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { InventarService } from './inventar.service';
import { UserService } from 'src/auth/user.service';
import { InventarItemEventType } from './schemas/inventar-item-event.schema';

@Controller('inventar')
export class InventarController {
  constructor(
    private readonly inventarService: InventarService,

    private readonly userService: UserService,
  ) {}

  @Get()
  async getInventar() {
    return this.inventarService.getExpandedInventarItems();
  }

  @Post()
  async createInventarItem(
    @Body() body: { deviceId: string; eventType: InventarItemEventType },
    @Req() req: Request,
  ) {
    const { deviceId, eventType } = body;

    Logger.log(
      `Creating inventar item with deviceId ${deviceId} to ${eventType}`,
    );
    if (!deviceId) {
      throw new HttpException('Invalid deviceId', HttpStatus.BAD_REQUEST);
    }

    const accessToken = (req.headers as any).authorization.split(' ')[1];
    const user = await this.userService.getUserByAccessToken(accessToken);
    if (!user) {
      Logger.warn('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const item = await this.inventarService.createInventarItem({
      deviceId,
    });

    await this.inventarService.createInventarItemEvent({
      date: new Date(),
      inventarItem: item,
      user,
      type: eventType,
    });

    return {};
  }

  @Post(':deviceId/events')
  async createInventarItemEvent(
    @Param('deviceId') deviceId: string,
    @Body() body: { eventType: InventarItemEventType },
    @Req() req: Request,
  ) {
    const { eventType } = body;

    Logger.log(
      `Creating inventar item event with deviceId ${deviceId} to ${eventType}`,
    );
    if (!deviceId) {
      throw new HttpException('Invalid deviceId', HttpStatus.BAD_REQUEST);
    }

    if (!eventType) {
      throw new HttpException('Invalid eventType', HttpStatus.BAD_REQUEST);
    }

    const accessToken = (req.headers as any).authorization.split(' ')[1];
    const user = await this.userService.getUserByAccessToken(accessToken);
    if (!user) {
      Logger.warn('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const item = await this.inventarService.getInventarItemByDeviceId(deviceId);
    if (!item) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }

    await this.inventarService.createInventarItemEvent({
      date: new Date(),
      inventarItem: item,
      user,
      type: eventType,
    });

    return {};
  }

  @Get(':deviceId/events')
  async getInventarItemEvents(@Param('deviceId') deviceId: string) {
    const item = await this.inventarService.getInventarItemByDeviceId(deviceId);
    if (!item) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }

    return this.inventarService.getInventarItemEvents(item);
  }
}
