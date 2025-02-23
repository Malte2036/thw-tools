import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../user/user.service';
import { OrganisationService } from '../../organisation/organisation.service';

@Injectable()
export class UserOrgMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.idTokenPayload) {
        req.user = null;
        req.organisation = null;
        return next();
      }

      const user = await this.userService.createOrUpdate(
        req.idTokenPayload.sub,
        {
          kindeId: req.idTokenPayload.sub,
          email: req.idTokenPayload.email,
          firstName: req.idTokenPayload.given_name,
          lastName: req.idTokenPayload.family_name,
          picture: req.idTokenPayload.picture,
        },
      );

      req.user = user;

      if (user) {
        const organisation =
          await this.organisationService.getPrimaryOrganisationsForUser(
            user.id,
          );
        req.organisation = organisation;
      } else {
        req.organisation = null;
      }
    } catch (error) {
      req.user = null;
      req.organisation = null;
    }

    next();
  }
}
