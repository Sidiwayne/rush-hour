import { AppService } from "./app.service";
import { Game } from "./interfaces";

const mockRedis = jest.fn().mockImplementation(() => ({
    getAllItems: jest.fn(),
    deleteItems: jest.fn()
}));

describe('cleanner cron', () => {
    it('should clean unactive', async () => {
        const mockedRedis = mockRedis();
        const service = new AppService(mockedRedis);
        const games: Game[] = [
            {id: '1', updatedAt: new Date().getTime()},
            {id: '2', updatedAt: new Date().getTime() - 3 * 60 * 1000}, // 3 minutes in the past
            {id: '3', updatedAt: new Date().getTime() - 11 * 60 * 1000},
            {id: '4', updatedAt: new Date().getTime() - 2 * 60 * 1000},
            {id: '7', updatedAt: new Date().getTime() - 5 * 60 * 1000}
        ]

        mockedRedis.getAllItems.mockResolvedValueOnce(games.map((g) => JSON.stringify(g)));
        mockedRedis.deleteItems.mockResolvedValueOnce('ok');

        await service.clean();
        
        expect(mockedRedis.getAllItems).toHaveBeenCalledTimes(1);
        expect(mockedRedis.deleteItems).toHaveBeenCalledWith(['3', 'move-outcome:3', '7', 'move-outcome:7']);
    });

    it('should not clean active games', async () => {
        const mockedRedis = mockRedis();
        const service = new AppService(mockedRedis);
        const games: Game[] = [
            {id: '1', updatedAt: new Date().getTime()}
        ]

        mockedRedis.getAllItems.mockResolvedValueOnce(games.map((g) => JSON.stringify(g)));
        await service.clean();
        
        expect(mockedRedis.getAllItems).toHaveBeenCalledTimes(1);
        expect(mockedRedis.deleteItems).toHaveBeenCalledTimes(0);
    });
});