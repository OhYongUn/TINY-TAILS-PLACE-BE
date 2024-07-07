import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsoketService {
  getHello(): string {
    return 'Hello World!';
  }
}
