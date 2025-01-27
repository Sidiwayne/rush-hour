
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Board } from 'src/models/board';

@Injectable()
export class RepoService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  getBoardById(id: number): Promise<Board> {
    return this.board.findUnique({where: {id: id}}).then((b) => ({id: b.id, matrix: b.matrix as number[][]}));
  }

  createBoard(matrix: number[][]): Promise<number> {
    return this.board.create({data: {matrix}}).then((b) => b.id);
  }


  async onModuleDestroy() {
    await this.$disconnect();
  }
}
