import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationService } from './organisation.service';
import { Organisation } from './entities/organisation.entity';
import { OrganisationController } from './organisation.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation]), UserModule],
  providers: [OrganisationService],
  controllers: [OrganisationController],
  exports: [OrganisationService],
})
export class OrganisationModule {}
