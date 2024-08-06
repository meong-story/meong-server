import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('cookie')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  app.enableCors({
    origin: ['https://api.owonie-dev.store', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('v1/api');
  await app.listen(3000);
}
bootstrap();
