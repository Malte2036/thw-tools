import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserCreatedWebhookEvent } from '@kinde/webhooks/dist/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async createUserFromKinde(webhookData: UserCreatedWebhookEvent) {
    if (await this.getUserByKindeId(webhookData.data.user.id)) {
      Logger.warn(
        `User from webhook already exists: ${webhookData.data.user.id}`,
      );
      return;
    }

    const user = new this.userModel({
      kindeId: webhookData.data.user.id,
      email: webhookData.data.user.email,
      firstName: webhookData.data.user.first_name,
      lastName: webhookData.data.user.last_name,
    });

    return user.save();
  }

  async getUserByKindeId(kindeId: string) {
    return this.userModel.findOne({
      kindeId: kindeId,
    });
  }

  private getHeader(accessToken: string) {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  async getUserByAccessToken(accessToken: string): Promise<UserDocument> {
    let kindeUserId: string;
    try {
      const res = await fetch(
        `${process.env.KINDE_DOMAIN}/oauth2/user_profile`,
        {
          method: 'GET',
          headers: this.getHeader(accessToken),
        },
      );
      const data = await res.json();

      kindeUserId = data.id;
    } catch (err) {
      Logger.error(err);
      throw new Error('Failed to fetch user from kinde');
    }

    return await this.getUserByKindeId(kindeUserId);
  }
}
