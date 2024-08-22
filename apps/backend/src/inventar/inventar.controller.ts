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
      Logger.warn(`Organisation for user ${user.id} not found`);
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

  @Post('events')
  async bulkCreateInventarItemEvents(
    @Body() body: { deviceId: string; eventType: InventarItemEventType }[],
    @Req() req: Request,
  ) {
    Logger.log(`Bulk creating inventar item events for ${body.length} items`);
    if (!body || !Array.isArray(body) || body.length === 0) {
      throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
    }

    const [user, organisation] = await this.getUserAndOrgFromRequest(req);

    await this.inventarService.bulkCreateInventarItemEvents(
      body,
      user,
      organisation,
      new Date(),
    );

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
