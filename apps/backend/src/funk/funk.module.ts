import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { FunkController } from './funk.controller';
import { FunkService } from './funk.service';
import {
  FunkItemEvent,
  FunkItemEventSchema,
} from './schemas/funk-item-event.schema';
import { FunkItem, FunkItemSchema } from './schemas/funlk-item.schema';
import { OrganisationModule } from 'src/organisation/organisation.module';
import {
  FunkItemEventBulk,
  FunkItemEventBulkSchema,
} from './schemas/funk-item-event-bulk.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FunkItem.name,
        schema: FunkItemSchema,
      },
      {
        name: FunkItemEvent.name,
        schema: FunkItemEventSchema,
      },
      {
        name: FunkItemEventBulk.name,
        schema: FunkItemEventBulkSchema,
      },
    ]),
    UserModule,
    OrganisationModule,
  ],
  providers: [FunkService],
  controllers: [FunkController],
})
export class FunkModule {}
