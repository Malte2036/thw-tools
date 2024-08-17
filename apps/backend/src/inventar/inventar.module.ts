import { Module } from '@nestjs/common';
import { InventarService } from './inventar.service';
import { InventarController } from './inventar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InventarItem,
  InventarItemSchema,
} from './schemas/inventar-item.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventarItem.name,
        schema: InventarItemSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [InventarService],
  controllers: [InventarController],
})
export class InventarModule {}
