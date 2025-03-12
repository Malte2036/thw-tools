import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class EnsureUserAndOrgGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
    }

    if (!request.user || !request.organisation) {
      throw new HttpException(
        'User or organisation not found',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
