import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SKIP_ORG_CHECK = 'skipOrgCheck';
export const SkipOrgCheck = () => SetMetadata(SKIP_ORG_CHECK, true);

@Injectable()
export class EnsureUserAndOrgGuard implements CanActivate {
  private readonly logger = new Logger(EnsureUserAndOrgGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipOrgCheck = this.reflector.get<boolean>(
      SKIP_ORG_CHECK,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    if (!request) {
      throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
    }

    if (!request.user) {
      this.logger.error('User not found in request', request.user);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!skipOrgCheck && !request.organisation) {
      this.logger.error(
        'Organisation not found in request',
        request.organisation,
      );
      throw new HttpException('Organisation not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
