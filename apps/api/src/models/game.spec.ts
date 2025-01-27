import { MovementDirection } from "../interfaces";
import { Game } from "./Game";

const initState: number[][] = Array.from({ length: 6 }, (_, index) =>  Array.from({ length: 6 }, (_, index) => 0));

describe('test Game class', ()  => {
    describe('findCar', () => {
        it('it should find', () => {
            const state = JSON.parse(JSON.stringify(initState));
            state[2][1] = 1;
            state[2][2] = 1;
    
            const game = new Game('id', 0, state);
            expect(game.findCar(1, state)).toEqual({id: 1, row: 2, col: 1, orientation: 'horizontal', length: 2});
        });

        it('it should not find - card id 2 not present', () => {
            const state = JSON.parse(JSON.stringify(initState));
            state[2][1] = 1;
            state[2][2] = 1;
    
            const game = new Game('id', 0, state);
            expect(game.findCar(2, state)).toBeUndefined();
        });
    });

    describe('moveCar', () => {
        it('it should return false - card id 2 not found', () => {
            const state = JSON.parse(JSON.stringify(initState));
            state[2][1] = 1;
            state[2][2] = 1;
            const game = new Game('id', 0, state);

            expect(game.moveCar({carId: 2, direction: MovementDirection.Up}, state)).toBeUndefined();
        });

        describe('impossible movement', () => {
            it('it should return false - impossible movement: orientation horizontal, move up', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[2][1] = 1;
                state[2][2] = 1;
                const game = new Game('id', 0, state);

                expect(game.moveCar({carId: 1, direction: MovementDirection.Up}, state)).toBeUndefined();
            });
    
            it('it should return false - impossible movement: orientation horizontal, move left, card at left edge', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[2][0] = 1;
                state[2][1] = 1;
                const game = new Game('id', 0, state);

                expect(game.moveCar({carId: 1, direction: MovementDirection.Left}, state)).toBeUndefined();
            });
    
            it('it should return false - impossible movement: orientation horizontal, move right, card at right edge', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[2][4] = 1;
                state[2][5] = 1;
                const game = new Game('id', 0, state);

                expect(game.moveCar({carId: 1, direction: MovementDirection.Right}, state)).toBeUndefined();
            });
    
            it('it should return false - impossible movement: orientation vertical, move up, card at up edge', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[0][0] = 1;
                state[1][0] = 1;
                const game = new Game('id', 0, state);

                expect(game.moveCar({carId: 1, direction: MovementDirection.Up}, state)).toBeUndefined();
            });
    
            it('it should return false - impossible movement: orientation vertical, move down, card at down edge', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[4][0] = 1;
                state[5][0] = 1;
                const game = new Game('id', 0, state);

                expect(game.moveCar({carId: 1, direction: MovementDirection.Down}, state)).toBeUndefined();
            });
        });

        describe('possible movement', () => {
            it('it move to left', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[2][1] = 1;
                state[2][2] = 1;
                const game = new Game('id', 0, state);

                const expectedState = JSON.parse(JSON.stringify(initState));
                expectedState[2][0] = 1;
                expectedState[2][1] = 1;

                expect(game.moveCar({carId: 1, direction: MovementDirection.Left}, state)).toEqual(game.moveCar({carId: 1, direction: MovementDirection.Left}, state));
            });

            it('it should move to right', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[2][1] = 1;
                state[2][2] = 1;
                const game = new Game('id', 0, state);

                const expectedState = JSON.parse(JSON.stringify(initState));
                expectedState[2][2] = 1;
                expectedState[2][3] = 1;

                expect(game.moveCar({carId: 1, direction: MovementDirection.Right}, state)).toEqual(expectedState);
            });

            it('it should move to up', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[1][0] = 1;
                state[2][0] = 1;
                const game = new Game('id', 0, state);

                const expectedState = JSON.parse(JSON.stringify(initState));
                expectedState[0][0] = 1;
                expectedState[1][0] = 1;
                expect(game.moveCar({carId: 1, direction: MovementDirection.Up}, state)).toEqual(expectedState);
            });

            it('it should return true - move to up', () => {
                const state = JSON.parse(JSON.stringify(initState));
                state[1][0] = 1;
                state[2][0] = 1;
                const game = new Game('id', 0, state);

                const expectedState = JSON.parse(JSON.stringify(initState));
                expectedState[2][0] = 1;
                expectedState[3][0] = 1;

                expect(game.moveCar({carId: 1, direction: MovementDirection.Down}, state)).toEqual(expectedState);
            });
        });
    });

    describe('getAllMovesFromState', () => {
        it('should return all moves possibles: 5', () => {
            const state = JSON.parse(JSON.stringify(initState));
            state[1][0] = 1;
            state[2][0] = 1;

            state[5][0] = 2;
            state[5][1] = 2;
            state[5][2] = 2;


            state[3][3] = 3;
            state[4][3] = 3;

            const game = new Game('id', 0, state);
            expect(game.getAllMovesFromState(state)).toHaveLength(5);
        })
    });

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