import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', //* Append
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
