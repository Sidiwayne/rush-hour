import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Board } from './models/board';

jest.mock("nanoid", () => {   return { nanoid: () => "123" } });

const mockAppService = {
  createBoard: jest.fn((board: Board): Promise<number> => {
    return Promise.resolve(0);
  })
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('readiness', () => {
    it('should return "Hello World!"', () => {
      expect(appController.heartbeat()).toBe('ok');
    });
  })
  
  describe('create-board', () => {
    it('ok: should call service.Board', async () => {
      mockAppService.createBoard.mockResolvedValueOnce(1);
      
      const board = new Board();
      await expect(appController.createBoard(board)).resolves.toBe(1);
      expect(mockAppService.createBoard).toHaveBeenCalledWith(board);
    });
  
    it('not ok: should throw an execption if service.Board fails', async () => {
      mockAppService.createBoard.mockRejectedValueOnce(new Error('create_board_failed'));
  
      const board = new Board();
      await expect(appController.createBoard(board)).rejects.toThrow(
        new HttpException('create_board_failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockAppService.createBoard).toHaveBeenCalledWith(board);
    });
  });
});
