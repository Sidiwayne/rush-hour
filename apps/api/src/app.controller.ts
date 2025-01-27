import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptions/global';
import { NotFoundExceptionFilter } from './exceptions/notFound';
import { AppService } from './app.service';
import { Board } from './models/board';
import { Step } from './interfaces';

@UseFilters(
  new GlobalExceptionFilter(),
  new NotFoundExceptionFilter(),
)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/__internal__/heartbeat')
  @HttpCode(HttpStatus.OK)
  heartbeat() {return 'ok';}

  @Post('/create-board')
  @HttpCode(HttpStatus.CREATED)
  createBoard(@Body() board: Board) {
    return this.appService.createBoard(board);
  }

  @Post('/start-game/:id')
  @HttpCode(HttpStatus.CREATED)
  startGame(@Param('id') id: any) {
    return this.appService.startGame(parseInt(id));
  }

  @Get('/game/:id')
  @HttpCode(HttpStatus.OK)
  getGame(@Param('id') id: string) {
    return this.appService.getGameById(id);
  }

  @Put('/move-car/:gameId')
  @HttpCode(HttpStatus.OK)
  moveCar(@Param('gameId') gameId: string, @Body() step: Step) {
    return this.appService.moveCar(gameId, step);
  }
}
