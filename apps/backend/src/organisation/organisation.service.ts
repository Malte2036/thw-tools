import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User, Organisation } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService) {}

  async getPrimaryOrganisationsForUser(userId: string) {
    return this.prisma.organisation.findFirst({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async addUserToOrganisation(user: User, inviteCode: string) {
    const organisation = await this.prisma.organisation.findUnique({
      where: { inviteCode },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!organisation) {
      throw new HttpException(
        'Invalid invite code - organization not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (organisation.members.some((member) => member.userId === user.id)) {
      throw new HttpException(
        'User already a member of this organisation',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.organisationMember.create({
      data: {
        userId: user.id,
        organisationId: organisation.id,
      },
    });
  }

  async createOrganisation(name: string, user: User) {
    return this.prisma.organisation.create({
      data: {
        name,
        inviteCode: randomUUID(),
        members: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async leaveOrganisation(user: User, organisation: Organisation) {
    await this.prisma.organisationMember.deleteMany({
      where: {
        userId: user.id,
        organisationId: organisation.id,
      },
    });
  }
}
