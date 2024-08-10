import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';

describe('WebsoketController', () => {
  let websoketController: WebsocketController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebsocketController],
      providers: [WebsocketService],
    }).compile();

    websoketController = app.get<WebsocketController>(WebsocketController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(websoketController.getHello()).toBe('Hello World!');
    });
  });
});
