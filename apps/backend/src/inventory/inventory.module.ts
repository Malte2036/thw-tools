import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { OrganisationModule } from 'src/organisation/organisation.module';
import { CsvImportService } from './csv-import.service';

@Module({
  imports: [PrismaModule, UserModule, OrganisationModule],
  controllers: [InventoryController],
  providers: [InventoryService, CsvImportService],
  exports: [InventoryService],
})
export class InventoryModule {}
