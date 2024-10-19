import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS before other middleware
  app.enableCors({ origin: '*' });

  // Increase the payload size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(bodyParser.text({ type: 'application/jwt' }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('THW-Tools Backend')
    .setDescription('API for the THW-Tools backend')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
