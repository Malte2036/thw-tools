import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { ApiTags } from '@nestjs/swagger';
import type { User, Organisation } from '@prisma/client';
import {
  EnsureUserAndOrgGuard,
  SkipOrgCheck,
} from '../shared/user-org/ensure-user-org.guard';
import { Request } from 'express';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  private readonly logger = new Logger(OrganisationController.name);
  constructor(private readonly organisationService: OrganisationService) {}

  @Get('me')
  @UseGuards(EnsureUserAndOrgGuard)
  async getOrganisationsForUser(@Req() req: Request) {
    return req.organisation;
  }

  @Post('join')
  async joinOrganisation(
    @Req() req: Request,
    @Body() data: { inviteCode: string },
  ) {
    if (req.organisation) {
      this.logger.warn(
        `User ${req.user.id} is already a member of an organisation`,
      );
      throw new HttpException(
        'User is already a member of an organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.organisationService.addUserToOrganisation(
      req.user,
      data.inviteCode,
    );
    this.logger.log(
      `User ${req.user.id} joined organisation with invite code ${data.inviteCode}`,
    );

    return await this.organisationService.getPrimaryOrganisationsForUser(
      req.user.id,
    );
  }

  @Post()
  @UseGuards(EnsureUserAndOrgGuard)
  @SkipOrgCheck()
  async createOrganisation(
    @Req() req: Request,
    @Body() data: { name: string },
  ) {
    if (req.organisation) {
      this.logger.warn(
        `User ${req.user.id} is already a member of an organisation`,
      );
      throw new HttpException(
        'User is already a member of an organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdOrg = await this.organisationService.createOrganisation(
      data.name,
      req.user,
    );

    this.logger.log(
      `User ${req.user.id} created organisation ${createdOrg.id}`,
    );

    return createdOrg;
  }

  @Post('leave')
  @UseGuards(EnsureUserAndOrgGuard)
  async leaveOrganisation(@Req() req: Request) {
    await this.organisationService.leaveOrganisation(
      req.user,
      req.organisation,
    );
    this.logger.log(
      `User ${req.user.id} left organisation ${req.organisation.id}`,
    );

    return {};
  }
}
