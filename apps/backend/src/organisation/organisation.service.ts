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

  async getOrganisationsForUser(userId: string) {
    return this.OrganisationModel.find({
      members: userId,
    });
  }

  async createOrganisation(data: Organisation) {
    if (data.members.length === 0) {
      throw new Error('Organisation must have at least one member');
    }

    return new this.OrganisationModel(data).save();
  }
}
