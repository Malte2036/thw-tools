import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { ThwinCsvImportService } from './thwin-csv-import.service';

@Module({
  imports: [PrismaModule, UserModule, OrganisationModule],
  controllers: [InventoryController],
  providers: [InventoryService, ThwinCsvImportService],
  exports: [InventoryService],
})
export class InventoryModule {}
