import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Organisation, User } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';

export async function getUserAndOrgFromRequest(
  req: Request,
  userService: UserService,
  organisationService: OrganisationService,
): Promise<[User | null, Organisation | null]> {
  const user = await userService.createOrUpdate(req.idTokenPayload.sub, {
    kindeId: req.idTokenPayload.sub,
    email: req.idTokenPayload.email,
    firstName: req.idTokenPayload.given_name,
    lastName: req.idTokenPayload.family_name,
    picture: req.idTokenPayload.picture,
  });

  const organisation = await organisationService.getPrimaryOrganisationsForUser(
    user.id,
  );

  return [user, organisation];
}

export async function getUserAndOrgFromRequestAndThrow(
  req: Request,
  userService: UserService,
  organisationService: OrganisationService,
): Promise<[User, Organisation]> {
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
