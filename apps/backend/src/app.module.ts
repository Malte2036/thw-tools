import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
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
import { Question } from './quiz-stats/schemas/question.schema';
import { QuestionAnswer } from './quiz-stats/schemas/question-answer.schema';
import { QuestionStats } from './quiz-stats/schemas/question-stats.schema';

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
      entities: [Question, QuestionAnswer, QuestionStats],
      // Do not set this in production
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
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
