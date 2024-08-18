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
import { InventarItemEventType } from './schemas/inventar-item-event.schema';
import { UserService } from 'src/user/user.service';
import { OrganisationService } from 'src/organisation/organisation.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { OrganisationDocument } from 'src/organisation/schemas/organisation.schema';

@Controller('inventar')
export class InventarController {
  constructor(
    private readonly inventarService: InventarService,

    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
  ) {}

  private async getUserAndOrgFromRequest(
    req: Request,
  ): Promise<[UserDocument, OrganisationDocument]> {
    const accessToken = (req.headers as any).authorization.split(' ')[1];
    const user = await this.userService.getUserByAccessToken(accessToken);
    if (!user) {
      Logger.warn('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const organisation =
      await this.organisationService.getPrimaryOrganisationsForUser(user.id);
    if (!organisation) {
      Logger.warn('Organisation for user not found');
      throw new HttpException(
        'Organisation for user not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return [user, organisation];
  }

  @Get()
  async getInventar(@Req() req: Request) {
    const [, organisation] = await this.getUserAndOrgFromRequest(req);
    return this.inventarService.getExpandedInventarItems(organisation._id);
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

    const [user, organisation] = await this.getUserAndOrgFromRequest(req);

    const item = await this.inventarService.createInventarItem(
      organisation._id,
      {
        deviceId,
        organisation,
      },
    );

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

    const [user, organisation] = await this.getUserAndOrgFromRequest(req);

    const item = await this.inventarService.getInventarItemByDeviceId(
      organisation._id,
      deviceId,
    );
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
  async getInventarItemEvents(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ) {
    const [, organisation] = await this.getUserAndOrgFromRequest(req);

    const item = await this.inventarService.getInventarItemByDeviceId(
      organisation._id,
      deviceId,
    );
    if (!item) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }

    return this.inventarService.getInventarItemEvents(item);
  }
}
