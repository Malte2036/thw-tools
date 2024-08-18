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
  Req,
} from '@nestjs/common';
import { InventarService } from './inventar.service';
import { UserService } from 'src/auth/user.service';

@Controller('inventar')
export class InventarController {
  constructor(
    private readonly inventarService: InventarService,

    private readonly userService: UserService,
  ) {}

  @Get()
  async getInventar() {
    return this.inventarService.getInventarItems();
  }

  @Post()
  async createInventarItem(
    @Body() body: { deviceId: string; isUsed: boolean },
    @Req() req: Request,
  ) {
    const { deviceId, isUsed } = body;

    Logger.log(`Creating inventar item with deviceId ${deviceId} to ${isUsed}`);
    if (!deviceId) {
      throw new HttpException('Invalid deviceId', HttpStatus.BAD_REQUEST);
    }

    const accessToken = (req.headers as any).authorization.split(' ')[1];
    const user = await this.userService.getUserByAccessToken(accessToken);
    if (!user) {
      Logger.warn('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.inventarService.createInventarItem({
      deviceId,
      isUsed,
      lastUsedBy: user,
    });
  }

  @Put(':deviceId')
  async updatenventarItem(
    @Param('deviceId') deviceId: string,
    @Body()
    body: {
      isUsed: boolean;
    },
    @Req() req: Request,
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

    const accessToken = (req.headers as any).authorization.split(' ')[1];
    const user = await this.userService.getUserByAccessToken(accessToken);
    if (!user) {
      Logger.warn('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const res = await this.inventarService.updateInventarItem(deviceId, {
      isUsed: body.isUsed,
      lastUsedBy: user,
    });
    if (res.matchedCount === 0) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }
  }
}
