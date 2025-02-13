import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { UserModule } from 'src/user/user.module';
import { OrganisationModule } from 'src/organisation/organisation.module';
import {
  InventoryItem,
  InventoryItemSchema,
} from './schemas/inventory-item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryItemCustomDataSchema } from './schemas/inventory-item-custom-data.schema';
import { InventoryItemCustomData } from './schemas/inventory-item-custom-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventoryItem.name,
        schema: InventoryItemSchema,
      },
      {
        name: InventoryItemCustomData.name,
        schema: InventoryItemCustomDataSchema,
      },
    ]),
    UserModule,
    OrganisationModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
