import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async updateOrCreateUser(userData: User) {
    try {
      const result = await this.userModel.findOneAndUpdate(
        { kindeId: userData.kindeId },
        { $set: userData },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      return result;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return await this.userModel.findOne({ kindeId: userData.kindeId });
      }
      this.logger.error(`Failed to upsert user: ${error.message}`);
      throw error;
    }
  }
}
