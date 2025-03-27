import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { FunkModule } from './funk/funk.module';
import { OrganisationModule } from './organisation/organisation.module';
import { QuizModule } from './quiz-stats/quiz.module';
import { UserModule } from './user/user.module';
import { InventoryModule } from './inventory/inventory.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserOrgMiddleware } from './shared/user-org/user-org.middleware';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 10,
      },
    ]),
    PrismaModule,
    QuizModule,
    FunkModule,
    AuthModule,
    UserModule,
    OrganisationModule,
    InventoryModule,
    AiModule,
    VehiclesModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, UserOrgMiddleware)
      .forRoutes('/funk', '/inventory', '/organisations', '/vehicles');

    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
