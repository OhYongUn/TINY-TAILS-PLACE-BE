import { NestFactory } from '@nestjs/core';
import { RestApiModule } from './rest-api.module';

async function bootstrap() {
  const app = await NestFactory.create(RestApiModule);
  app.enableCors(); // CORS 설정이 필요한 경우
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
