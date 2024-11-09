import { UserCreatedWebhookEvent } from '@kinde/webhooks/dist/types';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

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
}
