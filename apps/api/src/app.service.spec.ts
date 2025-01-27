import { NotFoundException } from "@nestjs/common";
import { AppService } from "./app.service";
import { RepoService } from "./storage/repo.service";
import { Game } from "./models/Game";
import { of } from "rxjs";

const redisMock = jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn()
}));

const kafkaMock = jest.fn().mockImplementation(() => ({
    emit: jest.fn()
}));

describe('AppService', () => {
    describe('getGameById', () => {
        it('should throw not found', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();

            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(null);
            await expect(service.getGameById('1')).rejects.toThrow(
                new NotFoundException('game with id: 1 not found'),
            );
        });

        it('should get game', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            
            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(new Game('1', 1, state).stringify());
            redisMocked.get.mockResolvedValue(null);

            const game = await service.getGameById('1');
            expect(game).toEqual(new Game('1', 1, state));
        });

        it('should get with out-come', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            
            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(new Game('1', 1, state).stringify());
            redisMocked.get.mockResolvedValue(JSON.stringify({currentMoveMinStep: 10, previousMoveMinStep: 23}));

            const game = await service.getGameById('1');
            expect(game.lastMoveResultIn).toEqual('good');
        });
    });
    describe('moveCar', () => {
        it('should return true: solved', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            state[2][4] = 1;
            state[2][5] = 1;
            
            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(new Game('1', 1, state).stringify());
            redisMocked.get.mockResolvedValue(null);

            expect(await service.moveCar('1', {carId: 1, direction: 0})).toBeTruthy();
        });

        it('should return throw card not found', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            
            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(new Game('1', 1, state).stringify());
            redisMocked.get.mockResolvedValue(null);

            await expect(service.moveCar('1', {carId: 1, direction: 0})).rejects.toThrow(
                new NotFoundException('card with id: 1 not found on grid'),
            );
        });

        it('should move car', async () => {
            const redisMocked = redisMock();
            const kafkaMocked = kafkaMock();
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            state[2][0] = 1;
            state[2][1] = 1;
            
            const service = new AppService(new RepoService(), redisMocked, kafkaMocked);

            redisMocked.get.mockResolvedValueOnce(new Game('1', 1, state).stringify());
            redisMocked.get.mockResolvedValue(null);
            redisMocked.set.mockResolvedValueOnce('');
            kafkaMocked.emit.mockReturnValue(of('ok'));

            state[2][0] = 0;
            state[2][1] = 0;
            state[2][1] = 1;
            state[2][2] = 1;

            expect(await service.moveCar('1', {carId: 1, direction: 1})).toBeFalsy();
            expect(kafkaMocked.emit).toHaveBeenCalled();
        });
    });
});