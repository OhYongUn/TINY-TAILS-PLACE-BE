import { NestFactory } from '@nestjs/core';
import { RestApiModule } from './rest-api.module';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(RestApiModule);
  app.enableCors(); // CORS 설정이 필요한 경우
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
