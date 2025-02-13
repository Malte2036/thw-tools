import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from './entities/organisation.entity';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class OrganisationService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) {}

  async getPrimaryOrganisationsForUser(userId: string) {
    return this.organisationRepository
      .createQueryBuilder('organisation')
      .innerJoinAndSelect('organisation.members', 'member')
      .where('member.id = :userId', { userId })
      .getOne();
  }

  async addUserToOrganisation(user: User, inviteCode: string) {
    const organisation = await this.organisationRepository.findOne({
      where: { inviteCode },
      relations: ['members'],
    });

    if (!organisation) {
      throw new HttpException(
        'Invalid invite code - organization not found',
        HttpStatus.NOT_FOUND,
      );
    }

    organisation.members.push(user);
    await this.organisationRepository.save(organisation);
  }

  async createOrganisation(name: string, user: User) {
    const organisation = this.organisationRepository.create({
      name,
      members: [user],
      inviteCode: randomUUID(),
    });

    return this.organisationRepository.save(organisation);
  }

  async leaveOrganisation(user: User, organisation: Organisation) {
    organisation.members = organisation.members.filter(
      (member) => member.id !== user.id,
    );
    await this.organisationRepository.save(organisation);
  }
}
