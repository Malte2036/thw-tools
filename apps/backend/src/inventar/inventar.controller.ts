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
import { ApiTags } from '@nestjs/swagger';

export async function getUserAndOrgFromRequest(
  req: Request,
  userService: UserService,
  organisationService: OrganisationService,
): Promise<[UserDocument, OrganisationDocument]> {
  const accessToken = (req.headers as any).authorization.split(' ')[1];
  const user = await userService.getUserByAccessToken(accessToken);
  if (!user) {
    Logger.warn('User not found');
    return [null, null];
  }

  const organisation = await organisationService.getPrimaryOrganisationsForUser(
    user.id,
  );
  if (!organisation) {
    Logger.warn(`Organisation for user ${user.id} not found`);
    return [user, null];
  }

  return [user, organisation];
}

export async function getUserAndOrgFromRequestAndThrow(
  req: Request,
  userService: UserService,
  organisationService: OrganisationService,
): Promise<[UserDocument, OrganisationDocument]> {
  const [user, organisation] = await getUserAndOrgFromRequest(
    req,
    userService,
    organisationService,
  );

  if (!user) {
    Logger.warn('User not found');
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  if (!organisation) {
    Logger.warn(`Organisation for user ${user.id} not found`);
    throw new HttpException(
      'Organisation for user not found',
      HttpStatus.NOT_FOUND,
    );
  }

  return [user, organisation];
}

@ApiTags('inventar')
@Controller('inventar')
export class InventarController {
  constructor(
    private readonly inventarService: InventarService,

    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
  ) {}

  @Get()
  async getInventar(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );
    return this.inventarService.getExpandedInventarItems(organisation._id);
  }

  @Post('events/bulk')
  async bulkCreateInventarItemEvents(
    @Body()
    body: {
      deviceIds: string[];
      batteryCount: number;
      eventType: InventarItemEventType;
    },
    @Req() req: Request,
  ) {
    Logger.log(
      `Bulk creating inventar item events with type ${body.eventType} for devices ${body.deviceIds.join(', ')}`,
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

    const [user, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

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
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    const item = await this.inventarService.getInventarItemByDeviceId(
      organisation._id,
      deviceId,
    );
    if (!item) {
      throw new HttpException('Inventar item not found', HttpStatus.NOT_FOUND);
    }

    return this.inventarService.getInventarItemEvents(item);
  }

  @Get('events/bulk')
  async getInventarItemEventBulks(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    return this.inventarService.getInventarItemEventBulks(organisation._id);
  }
}
