import { Module } from '@nestjs/common';
import { InventurController } from './inventur.controller';
import { InventurService } from './inventur.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { OrganisationModule } from 'src/organisation/organisation.module';

@Module({
  imports: [PrismaModule, UserModule, OrganisationModule],
  controllers: [InventurController],
  providers: [InventurService],
  exports: [InventurService],
})
export class InventurModule {}
