import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organisation } from './schemas/organisation.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private OrganisationModel: Model<Organisation>,
  ) {}

  async getPrimaryOrganisationsForUser(userId: string) {
    return this.OrganisationModel.findOne({
      members: userId,
    }).populate('members');
  }

  async addUserToOrganisation(user: User, inviteCode: string) {
    const organisation = await this.OrganisationModel.findOne({
      inviteCode,
    });

    if (!organisation) {
      throw new Error('Organisation not found');
    }

    organisation.members.push(user);
    await organisation.save();
  }

  async createOrganisation(name: string, user: User) {
    const organisation = new this.OrganisationModel({
      name,
      members: [user],
      inviteCode: randomUUID(),
    });

    await organisation.save();
    return organisation;
  }
}
