import { Injectable } from '@nestjs/common';
import { Game } from './models/game';
import { RedisService } from './storage/redis.service';
import { MoveOutCome } from './interfaces';

@Injectable()
export class AppService {
  constructor(private redis: RedisService) {}
  
  async computeMinStepToComplete(game: Game): Promise<void> {
    const steps = game.solve(game.state);
    if (!steps) {  // no solution
      return;
    }
    const moc = await this.redis.get(`move-outcome:${game.id}`).then((v) => JSON.parse(v) as MoveOutCome);
    const _moc = moc || {currentMoveMinStep: Number.MAX_VALUE};

    await this.redis.set(`move-outcome:${game.id}`, JSON.stringify({previousMoveMinStep: _moc.currentMoveMinStep, currentMoveMinStep: steps.length}));
  }
}
