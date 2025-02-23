import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GetUserAndOrg,
  GetUserAndOrgOrThrow,
} from '../shared/user-org/user-org.decorator';
import type { User, Organisation } from '@prisma/client';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get('me')
  async getOrganisationsForUser(
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ) {
    return organisation;
  }

  @Post('join')
  async joinOrganisation(
    @GetUserAndOrg() [user, organisation]: [User | null, Organisation | null],
    @Body() data: { inviteCode: string },
  ) {
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

  @Post()
  async createOrganisation(
    @GetUserAndOrg() [user, organisation]: [User | null, Organisation | null],
    @Body() data: { name: string },
  ) {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (organisation) {
      Logger.warn(`User ${user.id} is already a member of an organisation`);
      throw new HttpException(
        'User is already a member of an organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdOrg = await this.organisationService.createOrganisation(
      data.name,
      user,
    );

    Logger.log(`User ${user.id} created organisation ${createdOrg.id}`);

    return createdOrg;
  }

  @Post('leave')
  async leaveOrganisation(
    @GetUserAndOrgOrThrow() [user, organisation]: [User, Organisation],
  ) {
    await this.organisationService.leaveOrganisation(user, organisation);
    Logger.log(`User ${user.id} left organisation ${organisation.id}`);

    return {};
  }
}
