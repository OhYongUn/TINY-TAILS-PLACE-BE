import { Controller, Get } from '@nestjs/common';
import { WebsoketService } from './websoket.service';

@Controller()
export class WebsoketController {
  constructor(private readonly websoketService: WebsoketService) {}

  @Get()
  getHello(): string {
    return this.websoketService.getHello();
  }
}
