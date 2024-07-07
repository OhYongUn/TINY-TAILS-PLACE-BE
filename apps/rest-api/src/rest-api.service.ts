import { Injectable } from '@nestjs/common';

@Injectable()
export class RestApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
