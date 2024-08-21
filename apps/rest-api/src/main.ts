import { NestFactory } from '@nestjs/core';
import { RestApiModule } from './rest-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SuccessResponseInterceptor } from '@app/common/interceptors/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(RestApiModule);
  app.enableCors(); // CORS 설정이 필요한 경우

  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //const httpAdapterHost = app.get(HttpAdapterHost);
  //app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
