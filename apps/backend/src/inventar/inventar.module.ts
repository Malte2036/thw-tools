import { Module } from '@nestjs/common';
import { InventarService } from './inventar.service';
import { InventarController } from './inventar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventarItem,
  InventarItemSchema,
} from './schemas/inventar-item.schema';
import { AuthModule } from 'src/auth/auth.module';
import {
  InventarItemEvent,
  InventarItemEventSchema,
} from './schemas/inventar-item-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventarItem.name,
        schema: InventarItemSchema,
      },
      {
        name: InventarItemEvent.name,
        schema: InventarItemEventSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [InventarService],
  controllers: [InventarController],
})
export class InventarModule {}
