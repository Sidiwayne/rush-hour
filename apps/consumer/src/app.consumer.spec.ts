import { Test, TestingModule } from '@nestjs/testing';
import { AppConsumer } from './app.consumer';
import { AppService } from './app.service';

const mockAppService = {
  computeMinStepToComplete: jest.fn()
}

describe('AppConsumer', () => {
  let appConsumer: AppConsumer;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppConsumer],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService
        }
      ],
    }).compile();

    appConsumer = app.get<AppConsumer>(AppConsumer);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      appConsumer.computeMinStepToComplete({id: '1', boardId: 1, state: []})
      expect(mockAppService.computeMinStepToComplete).toHaveBeenCalled();
    });
  });
});
