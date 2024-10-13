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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventoryItem.name,
        schema: InventoryItemSchema,
      },
    ]),
    UserModule,
    OrganisationModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
