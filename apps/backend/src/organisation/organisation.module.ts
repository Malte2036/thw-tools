import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organisation,
  OrganisationSchema,
} from './schemas/organisation.schema';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organisation.name,
        schema: OrganisationSchema,
      },
    ]),
    UserModule,
  ],
  providers: [OrganisationService],
  exports: [OrganisationService],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
