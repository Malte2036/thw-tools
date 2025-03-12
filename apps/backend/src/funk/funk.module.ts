import { Module } from '@nestjs/common';
import { FunkService } from './funk.service';
import { FunkController } from './funk.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [PrismaModule, UserModule, OrganisationModule],
  controllers: [FunkController],
  providers: [FunkService],
  exports: [FunkService],
})
export class FunkModule {}
