import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizStatsModule } from './quiz-stats/quiz-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    QuizStatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
