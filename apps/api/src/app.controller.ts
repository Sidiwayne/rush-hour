import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptions/global';
import { NotFoundExceptionFilter } from './exceptions/notFound';
import { AppService } from './app.service';
import { Board } from './models/board';
import { Step } from './interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Game } from './models/game';

@ApiTags('rush_hour_api')
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'board created'
  })
  createBoard(@Body() board: Board) {
    return this.appService.createBoard(board);
  }

  @Post('/start-game/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'start game on board with id'
  })
  startGame(@Param('id') id: string) {
    return this.appService.startGame(parseInt(id));
  }

  @Get('/game/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get game by id',
    type: Game
  })
  getGame(@Param('id') id: string) {
    return this.appService.getGameById(id);
  }

  @Put('/move-car/:gameId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'move car on board'
  })
  moveCar(@Param('gameId') gameId: string, @Body() step: Step) {
    return this.appService.moveCar(gameId, step);
  }
}
