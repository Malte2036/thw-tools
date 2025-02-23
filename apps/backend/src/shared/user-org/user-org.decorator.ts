import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';
import {
  getUserAndOrgFromRequest,
  getUserAndOrgFromRequestAndThrow,
} from './user-org.util';

export const getUserAndOrgFactory = async (
  data: unknown,
  context: ExecutionContext,
) => {
  const request = context.switchToHttp().getRequest();
  const userService = request.app.get(UserService);
  const organisationService = request.app.get(OrganisationService);

  return getUserAndOrgFromRequest(request, userService, organisationService);
};

export const getUserAndOrgOrThrowFactory = async (
  data: unknown,
  context: ExecutionContext,
) => {
  const request = context.switchToHttp().getRequest();
  const userService = request.app.get(UserService);
  const organisationService = request.app.get(OrganisationService);

  return getUserAndOrgFromRequestAndThrow(
    request,
    userService,
    organisationService,
  );
};

export const GetUserAndOrg = createParamDecorator(getUserAndOrgFactory);
export const GetUserAndOrgOrThrow = createParamDecorator(
  getUserAndOrgOrThrowFactory,
);
