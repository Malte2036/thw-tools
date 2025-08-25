import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';

@Module({
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
