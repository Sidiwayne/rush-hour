import { AppService } from "./app.service";
import { Game } from "./models/game";

const mockRedis = jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe('AppService', () => {
    describe('computeMinStepToComplete', () => {
        it('should not compute min step when no solution: no red car', () => {
            const mockedRedis = mockRedis();
            const service =  new AppService(mockedRedis);
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
    
            service.computeMinStepToComplete(new Game('1', 1, state));
            expect(mockedRedis.get).toHaveBeenCalledTimes(0);
        });

        it('should not compute min step when no solution: red car move blocked', () => {
            const mockedRedis = mockRedis();
            const service =  new AppService(mockedRedis);
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            state[0][0] = 1;
            state[0][1] = 1;
            state[0][2] = 2;
            state[0][3] = 2;

            service.computeMinStepToComplete(new Game('1', 1, state));
            expect(mockedRedis.get).toHaveBeenCalledTimes(0);
        });

        it('should compute min step', async () => {
            const mockedRedis = mockRedis();
            const service =  new AppService(mockedRedis);
            const state = Array.from({ length: 6 }, () =>  Array.from({ length: 6 }, () => 0));
            state[0][3] = 1;
            state[0][4] = 1;

            mockedRedis.get.mockResolvedValueOnce(null);
            mockedRedis.set.mockResolvedValueOnce(undefined);

            await service.computeMinStepToComplete(new Game('1', 1, state));
            expect(mockedRedis.get).toHaveBeenCalledTimes(1);
            expect(mockedRedis.set).toHaveBeenCalledWith('move-outcome:1', JSON.stringify({previousMoveMinStep: Number.MAX_VALUE, currentMoveMinStep: 1}));
        });
    });
});