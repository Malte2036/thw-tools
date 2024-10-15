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
import { OrganisationService } from 'src/organisation/organisation.service';
import { OrganisationDocument } from 'src/organisation/schemas/organisation.schema';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { FunkService } from './funk.service';
import { FunkItemEventType } from './schemas/funk-item-event.schema';

export async function getUserAndOrgFromRequest(
  req: Request,
  userService: UserService,
  organisationService: OrganisationService,
): Promise<[UserDocument | null, OrganisationDocument | null]> {
  const accessToken = (req.headers as any).authorization.split(' ')[1];
  const user = await userService.getUserByAccessToken(accessToken);
  if (!user) {
    Logger.warn('User not found');
    return [null, null];
  }

  const organisation = await organisationService.getPrimaryOrganisationsForUser(
    user.id,
  );

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
    throw new HttpException(
      'Organisation for user not found',
      HttpStatus.NOT_FOUND,
    );
  }

  return [user, organisation];
}

@ApiTags('funk')
@Controller('funk')
export class FunkController {
  constructor(
    private readonly funkService: FunkService,

    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
  ) {}

  @Get()
  async getFunkItems(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    return this.funkService.getFunkItems(organisation._id);
  }

  @Post('events/bulk')
  async bulkCreateFunkItemEvents(
    @Body()
    body: {
      deviceIds: string[];
      batteryCount: number;
      eventType: FunkItemEventType;
    },
    @Req() req: Request,
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

    const [user, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

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
    @Req() req: Request,
  ) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    const item = await this.funkService.getFunkItemByDeviceId(
      organisation._id,
      deviceId,
    );
    if (!item) {
      throw new HttpException('Funk item not found', HttpStatus.NOT_FOUND);
    }

    return this.funkService.getFunkItemEvents(item);
  }

  @Get('events/bulk')
  async getFunkItemEventBulks(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    return this.funkService.getFunkItemEventBulks(organisation._id);
  }

  @Get('events/bulk/export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="funk_item_events.csv"')
  async exportFunkItemEventBulksAsCsv(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );
    3;
    const csvData = await this.funkService.exportFunkItemEventBulksAsCsv(
      organisation._id,
    );

    return csvData;
  }
}
