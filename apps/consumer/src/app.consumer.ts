import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Game } from './models/game';

@Controller()
export class AppConsumer {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('car-moved')
  async computeMinStepToComplete(@Payload() msg: {id: string, boardId: number, state: number[][]}) {
    try {
      console.log('incoming msg: ', msg);
      await this.appService.computeMinStepToComplete(new Game(msg.id, msg.boardId, msg.state));
    } catch(e) {
      // log.err + prometheus metrics
      console.log('errrorrr ==>', e)
    }
  }
}
