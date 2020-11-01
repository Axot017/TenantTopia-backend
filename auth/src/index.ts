import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('auth');
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'auth_queue',
    },
  });
  app.startAllMicroservicesAsync();

  const options = new DocumentBuilder()
    .setTitle('Tenant Topia - Auth')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('auth/api', app, document);

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.useStaticAssets(join(__dirname, 'public'));
  app.setViewEngine('hbs');

  await app.listen(parseInt(process.env.PORT) || 3100);
})();
