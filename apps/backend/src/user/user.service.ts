import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findByKindeId(kindeId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { kindeId } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createOrUpdate(
    kindeId: string,
    userData: Partial<User>,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      // Lock the row if it exists
      let user = await manager
        .createQueryBuilder(User, 'user')
        .setLock('pessimistic_write')
        .where('user.kindeId = :kindeId', { kindeId })
        .getOne();

      if (!user) {
        user = manager.create(User, { kindeId, ...userData });
      } else {
        Object.assign(user, userData);
      }

      return manager.save(User, user);
    });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
