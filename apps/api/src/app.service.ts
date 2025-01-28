import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { nanoid } from 'nanoid';
import { firstValueFrom } from 'rxjs';
import { MoveOutCome } from './interfaces/';
import { Board } from './models/board';
import { Game } from './models/game';
import { Step } from './interfaces/';
import { RepoService } from './storage/repo.service';
import { RedisService } from './storage/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private repository: RepoService, private redis: RedisService, @Inject('KAFKA_CLIENT') private kafka: ClientKafka){}

  getBoardById(id: number): Promise<Board> {
    return this.repository.getBoardById(id);
  }

  createBoard(board: Board): Promise<number> {
    return this.repository.createBoard(board.matrix);
  }

  async startGame(boardId: number): Promise<string> {
    try {
      const id = nanoid();
      const board = await this.getBoardById(boardId);
      await this.redis.set(id, (new Game(id, boardId, board.matrix).stringify()));
      return id;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`board with id: ${boardId} not found`);
        }
      }
      throw e;
    }
  }

  async getGameById(id: string): Promise<Game> {
    const game = await this.redis.get(id).then((game) => JSON.parse(game));
    if (!game) {
      throw new NotFoundException(`game with id: ${id} not found`);
    }
    const lastMoveOutCome = await this.redis.get(`move-outcome:${id}`).then((v) => JSON.parse(v) as MoveOutCome);
    return (new Game(id, game.boardId, game.state)).withMoveOutCome(lastMoveOutCome);
  }

  async moveCar(gameId: string, step: Step): Promise<boolean> {
    const game = await this.getGameById(gameId);
    if (game.isSolved(game.state)) {
      return true;
    }

    const car = game.findCar(step.carId, game.state);
    if (!car) {
      throw new NotFoundException(`card with id: ${step.carId} not found on grid`);
    }

    const newState = game.moveCar(step, game.state)
    if (!newState) {
      throw new BadRequestException(`Forbidden move of card with id ${step.carId}: {orientation: ${car.orientation}, desireMove: ${step.direction}}`);
    }
    
    game.state = newState;
    game.updatedAt = new Date().getTime();
    await this.redis.set(gameId, game.stringify());


    await firstValueFrom(this.kafka.emit('car-moved', game.stringify()));

    return false;
  }

}
