import { NestFactory } from '@nestjs/core';
import { WebsoketModule } from './websoket.module';

async function bootstrap() {
  const app = await NestFactory.create(WebsoketModule);
  await app.listen(3000);
}
bootstrap();
