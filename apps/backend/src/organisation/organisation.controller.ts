import { Controller, Get, Req } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { getUserAndOrgFromRequest } from 'src/inventar/inventar.controller';
import { UserService } from 'src/user/user.service';

@Controller('organisations')
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,

    private readonly userService: UserService,
  ) {}

  @Get('me')
  async getOrganisationsForUser(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequest(
      req,
      this.userService,
      this.organisationService,
    );
    return organisation;
  }
}
