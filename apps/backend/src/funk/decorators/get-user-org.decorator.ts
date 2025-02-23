import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';
import {
  getUserAndOrgFromRequest,
  getUserAndOrgFromRequestAndThrow,
} from '../utils/get-user-org.util';

export const GetUserAndOrg = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userService = request.app.get(UserService);
    const organisationService = request.app.get(OrganisationService);

    return getUserAndOrgFromRequest(request, userService, organisationService);
  },
);

export const GetUserAndOrgOrThrow = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userService = request.app.get(UserService);
    const organisationService = request.app.get(OrganisationService);

    return getUserAndOrgFromRequestAndThrow(
      request,
      userService,
      organisationService,
    );
  },
);
