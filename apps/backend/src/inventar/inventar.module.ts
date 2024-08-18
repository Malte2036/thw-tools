import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { InventarController } from './inventar.controller';
import { InventarService } from './inventar.service';
import {
  InventarItemEvent,
  InventarItemEventSchema,
} from './schemas/inventar-item-event.schema';
import {
  InventarItem,
  InventarItemSchema,
} from './schemas/inventar-item.schema';
import { OrganisationModule } from 'src/organisation/organisation.module';

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
    UserModule,
    OrganisationModule,
  ],
  providers: [InventarService],
  controllers: [InventarController],
})
export class InventarModule {}
