import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organisation } from './schemas/organisation.schema';
import { Model } from 'mongoose';

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

  async createOrganisation(data: Organisation) {
    if (data.members.length === 0) {
      throw new Error('Organisation must have at least one member');
    }

    return new this.OrganisationModel(data).save();
  }
}
