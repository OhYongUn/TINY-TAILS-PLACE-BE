import { NestFactory } from '@nestjs/core';
import { RestApiModule } from './rest-api.module';

async function bootstrap() {
  const app = await NestFactory.create(RestApiModule);
  await app.listen(3000);
}
bootstrap();
