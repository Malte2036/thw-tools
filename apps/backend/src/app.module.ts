import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppService } from './app.service';
import { QuizModule } from './quiz-stats/quiz.module';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { InventarModule } from './inventar/inventar.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 10,
      },
    ]),
    QuizModule,
    InventarModule,
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
export class AppModule {}
