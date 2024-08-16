import { Module } from '@nestjs/common';
import { InventarService } from './inventar.service';
import { InventarController } from './inventar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventarItem,
  InventarItemSchema,
} from './schemas/inventar-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventarItem.name,
        schema: InventarItemSchema,
      },
    ]),
  ],
  providers: [InventarService],
  controllers: [InventarController],
})
export class InventarModule {}
