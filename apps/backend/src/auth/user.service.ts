import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
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
      kinde_id: webhookData.data.user.id,
      first_name: webhookData.data.user.first_name ?? null,
      last_name: webhookData.data.user.last_name ?? null,
    });

    return user.save();
  }

  async getUserByKindeId(kindeId: string) {
    return this.userModel.findOne({
      kinde_id: kindeId,
    });
  }
}
