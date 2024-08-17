import { decodeWebhook } from '@kinde/webhooks';
import { UserCreatedWebhookEvent } from '@kinde/webhooks/dist/types';
import {
  BadRequestException,
  Controller,
  Headers,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('content-type') contentType: string,
  ) {
    Logger.log('Webhook received');

    // Ensure content-type is 'application/jwt'
    if (contentType !== 'application/jwt') {
      throw new BadRequestException('Invalid content type');
    }

    try {
      // The request body contains the JWT as a string
      const jwtToken = req.body;

      const decoded = await decodeWebhook(jwtToken, process.env.KINDE_DOMAIN);
      if (!decoded) {
        throw new BadRequestException('Invalid JWT token');
      }

      if (decoded.type === 'user.created') {
        const createUserPayload = await decodeWebhook<UserCreatedWebhookEvent>(
          jwtToken,
          process.env.KINDE_DOMAIN,
        );

        // Create a user in the database
        await this.userService.createUserFromKinde(createUserPayload);
        Logger.log(
          `User created from webhook. KindeId: ${createUserPayload.data.user.id}`,
        );
      } else {
        Logger.warn(`Unhandled webhook event type: ${decoded.type}`);
      }

      return { message: 'Webhook processed' };
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new BadRequestException('Invalid JWT token');
    }
  }
}
