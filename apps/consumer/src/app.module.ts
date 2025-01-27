import { Module } from '@nestjs/common';
import { AppConsumer } from './app.consumer';
import { AppService } from './app.service';
import { RedisService } from './storage/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppConsumer],
  providers: [AppService, RedisService],
})
export class AppModule {}
