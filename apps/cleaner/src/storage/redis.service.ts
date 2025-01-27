
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private redis: Redis;
    constructor(private configService: ConfigService) {
        this.redis = new Redis(
            this.configService.get<number>('REDIS_PORT'),
            this.configService.get<string>('REDIS_HOST')
        )
    }

    async getAllItems(): Promise<string[]> {
        const stream = this.redis.scanStream({ match: '*', count: 100 });
        const keys = [];
      
        for await (const keyBatch of stream) {
          keys.push(...keyBatch);
        }

        if (keys.length > 0) {
            return this.redis.mget(keys.filter((k) => !k.includes('move-outcome:')));
        }
        return [];
    }

    deleteItems(keys: string[]): Promise<number> {
        return this.redis.del(keys);
    }
}
