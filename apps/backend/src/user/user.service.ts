import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByKindeId(kindeId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { kindeId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createOrUpdate(
    kindeId: string,
    userData: Partial<User>,
  ): Promise<User> {
    return this.prisma.user.upsert({
      where: { kindeId },
      create: { kindeId, ...userData },
      update: userData,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
