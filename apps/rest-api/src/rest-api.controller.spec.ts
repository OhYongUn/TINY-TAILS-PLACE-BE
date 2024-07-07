import { Test, TestingModule } from '@nestjs/testing';
import { RestApiController } from './rest-api.controller';
import { RestApiService } from './rest-api.service';

describe('RestApiController', () => {
  let restApiController: RestApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RestApiController],
      providers: [RestApiService],
    }).compile();

    restApiController = app.get<RestApiController>(RestApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(restApiController.getHello()).toBe('Hello World!');
    });
  });
});
