console.log("************************************");
console.log("*                                  *");
console.log("*   Welcome to QR BACKEND  *");
console.log("*                                  *");
console.log("************************************");

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors(); 
  await app.listen(8080);
}

bootstrap();
