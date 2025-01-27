
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

    set(key: string, value: string): Promise<string> {
        return this.redis.set(key, value);
    }

    get(key: string): Promise<string> {
        return this.redis.get(key);
    }
}
