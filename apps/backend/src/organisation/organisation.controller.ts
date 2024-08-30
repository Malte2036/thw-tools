import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import {
  getUserAndOrgFromRequest,
  getUserAndOrgFromRequestAndThrow,
} from 'src/inventar/inventar.controller';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,

    private readonly userService: UserService,
  ) {}

  @Get('me')
  async getOrganisationsForUser(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );
    return organisation;
  }

  @Post('join')
  async joinOrganisation(
    @Req() req: Request,
    @Body() data: { inviteCode: string },
  ) {
    const [user, organisation] = await getUserAndOrgFromRequest(
      req,
      this.userService,
      this.organisationService,
    );

    if (organisation) {
      Logger.warn(`User ${user.id} is already a member of an organisation`);
      throw new HttpException(
        'User is already a member of an organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.organisationService.addUserToOrganisation(user, data.inviteCode);
    Logger.log(
      `User ${user.id} joined organisation with invite code ${data.inviteCode}`,
    );

    return await this.organisationService.getPrimaryOrganisationsForUser(
      user.id,
    );
  }
}
