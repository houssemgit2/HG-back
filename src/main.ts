import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger('bootstrap_main.ts');
  logger.log('starting the application....');

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new TransformInterceptor());

  // ensuring all endpoints are protected from receiving incorrect data.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.setGlobalPrefix('v1');
  // swagger initialization
  const options = new DocumentBuilder()
    .setTitle('HealthyGroup')
    .setDescription('HealthyGRoup API')
    .setVersion('2.0')
    .addTag('hg')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = 3000;
  await app.listen(port);

  logger.log(`Application listening in port ${port}`);
  console.log('API url: http://localhost:3000/api');
}
bootstrap();
