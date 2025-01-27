import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisService } from './storage/redis.service';
import { Game } from './interfaces';
import { isDatePassedBy5Minutes } from './helper';

@Injectable()
export class AppService {

  constructor(private redis: RedisService){}

  getKeysToDelete(item: Game): string[] {
    if(isDatePassedBy5Minutes(item.updatedAt)) {
      return [item.id, `move-outcome:${item.id}`];
    }
    return [];
  }

  @Cron('*/5 * * * * *')
  async clean() {
    try {
      const items = await this.redis.getAllItems();
      const keysToDelete = items.reduce((acc, currItem) => [...acc, ...this.getKeysToDelete(JSON.parse(currItem) as Game)], []);
      if (keysToDelete.length === 0) {
        return;
      }
      await this.redis.deleteItems(keysToDelete);
      console.log(`deleted unactive games (ids): ${keysToDelete}`);
    } catch(e) {
      console.log('cleaned failed with error', e);
    }
    
  }
}
