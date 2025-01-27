import { Game } from "./Game";

describe('test Game class', ()  => {
    describe('solve', () => {
        it('Use case 1: drive to the right', () => {
            const state:number[][] = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ];

            const game = new Game('id', 0, state);
            expect(game.solve(state)).toHaveLength(2);
        });

        it('Use case 2: impossible board', () => {
            const state: number[][] = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 2, 2, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ];

            const game = new Game('id', 0, state);
            expect(game.solve(state)).toBeUndefined();
        });

        it('Use case 3: simple solution', () => {
            const state:number[][] = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 2, 0, 0, 0],
                [1, 1, 2, 3, 0, 0],
                [0, 0, 0, 3, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ];

            const game = new Game('id', 0, state);
            const steps = game.solve(state);
            expect(steps).toHaveLength(6);
        });

        it('Use case 3: simple solution', () => {
            const state:number[][] = [
                [2, 2, 2, 0, 0, 3],
                [0, 0, 4, 0, 0, 3],
                [1, 1, 4, 0, 0, 3],
                [5, 0, 4, 0, 6, 6],
                [5, 0, 0, 0, 7, 0],
                [8, 8, 8, 0, 7, 0]
            ];

            const game = new Game('id', 0, state);
            const steps = game.solve(state);
            expect(steps).toHaveLength(25);
        });
    });
})