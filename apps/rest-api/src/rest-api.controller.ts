import { Controller, Get } from '@nestjs/common';
import { RestApiService } from './rest-api.service';

@Controller()
export class RestApiController {
  constructor(private readonly restApiService: RestApiService) {}

  @Get()
  getHello(): string {
    return this.restApiService.getHello();
  }
}
