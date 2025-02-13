import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunkController } from './funk.controller';
import { FunkService } from './funk.service';
import { FunkItem } from './entities/funk-item.entity';
import { FunkItemEvent } from './entities/funk-item-event.entity';
import { FunkItemEventBulk } from './entities/funk-item-event-bulk.entity';
import { UserModule } from '../user/user.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FunkItem, FunkItemEvent, FunkItemEventBulk]),
    UserModule,
    OrganisationModule,
  ],
  controllers: [FunkController],
  providers: [FunkService],
})
export class FunkModule {}
