import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryItemCustomData } from './entities/inventory-item-custom-data.entity';
import { UserModule } from 'src/user/user.module';
import { OrganisationModule } from 'src/organisation/organisation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, InventoryItemCustomData]),
    UserModule,
    OrganisationModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
