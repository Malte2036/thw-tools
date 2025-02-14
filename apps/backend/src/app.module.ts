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
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Organisation } from './organisation/entities/organisation.entity';
import { InventoryItem } from './inventory/entities/inventory-item.entity';
import { InventoryItemCustomData } from './inventory/entities/inventory-item-custom-data.entity';
import { FunkItem } from './funk/entities/funk-item.entity';
import { FunkItemEvent } from './funk/entities/funk-item-event.entity';
import { FunkItemEventBulk } from './funk/entities/funk-item-event-bulk.entity';
import { Question } from './quiz-stats/schemas/question.schema';
import { QuestionStats } from './quiz-stats/schemas/question-stats.schema';
import { QuestionAnswer } from './quiz-stats/schemas/question-answer.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      schema: 'public',
      entities: [
        User,
        Organisation,
        InventoryItem,
        InventoryItemCustomData,
        FunkItem,
        FunkItemEvent,
        FunkItemEventBulk,
        Question,
        QuestionStats,
        QuestionAnswer,
      ],
      // Do not set this in production
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 10,
      },
    ]),
    QuizModule,
    FunkModule,
    AuthModule,
    UserModule,
    OrganisationModule,
    InventoryModule,
    AiModule,
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
      .apply(AuthMiddleware)
      .forRoutes('/funk', '/inventory', '/organisations');

    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
