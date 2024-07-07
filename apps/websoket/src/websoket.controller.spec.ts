import { Test, TestingModule } from '@nestjs/testing';
import { WebsoketController } from './websoket.controller';
import { WebsoketService } from './websoket.service';

describe('WebsoketController', () => {
  let websoketController: WebsoketController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebsoketController],
      providers: [WebsoketService],
    }).compile();

    websoketController = app.get<WebsoketController>(WebsoketController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(websoketController.getHello()).toBe('Hello World!');
    });
  });
});
