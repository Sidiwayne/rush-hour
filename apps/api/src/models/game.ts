import { ApiProperty } from "@nestjs/swagger";
import { Car, MovementDirection, MoveOutCome, Step } from "../interfaces";



export class Game {
    @ApiProperty()
    id: string;
    @ApiProperty()
    boardId: number;
    @ApiProperty({
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'number',
            },
        },
    })
    state: number[][];
    @ApiProperty()
    lastMoveResultIn: string;
    @ApiProperty()
    updatedAt: number;

    constructor(id: string, boardId: number, state: number[][]) {
        this.id = id;
        this.boardId = boardId;
        this.state = state;
    }

    stringify(): string {
        return JSON.stringify({
            id: this.id,
            boardId: this.boardId,
            state: this.state,
            lastMoveResultIn: this.lastMoveResultIn,
            updatedAt: this.updatedAt
        });
    }

    withMoveOutCome(moc: MoveOutCome): Game {
        if (moc !== null) {
            if (moc.currentMoveMinStep < moc.previousMoveMinStep) {
                this.lastMoveResultIn = 'good';
            } else if (moc.currentMoveMinStep === moc.previousMoveMinStep) {
                this.lastMoveResultIn = 'waste';
            } else if (moc.currentMoveMinStep > moc.previousMoveMinStep) {
                this.lastMoveResultIn = 'blunder';
            }
        }
        return this;
    }

    isSolved(state: number[][]): boolean {
        const redCar = this.findCar(1, state);
        return redCar && redCar.col + redCar.length - 1 === state.length - 1;
    }

    findCar(carId: number, state: number[][]): Car | undefined {
        for(let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < state.length; j++) {
                if (state[i][j] === carId) {
                    if (state[i][j+1] === carId) {
                        let length = 1;
                        while (j + length < state.length && state[i][j+length] == carId) length++;
                        return {id: carId, row: i, col: j, orientation: 'horizontal', length};
                    } else if (state[i+1][j] === carId) {
                        let length = 1;
                        while (i + length < state.length && state[i+length][j] == carId) length++;
                        return {id: carId, row: i, col: j, orientation: 'vertical', length};
                    }
                }
            }
        }
        return undefined;
    }

    moveCar(step: Step, state: number[][]): number[][] | undefined {
        const car = this.findCar(step.carId, state);
        if (!car) {
            return;
        }

        if ((car.orientation === 'horizontal' && [MovementDirection.Up, MovementDirection.Down].includes(step.direction)) ||
            (car.orientation === 'vertical' && [MovementDirection.Right, MovementDirection.Left].includes(step.direction))) {
            return;
        }
        
        switch (step.direction) {
            case MovementDirection.Left:
                if (car.col > 0 && state[car.row][car.col - 1] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(state)) as number[][];
                    newGrid[car.row].fill(0, car.col, car.col + car.length);
                    newGrid[car.row].fill(step.carId, car.col - 1, car.col - 1 + car.length);
                    return newGrid;
                }
                return;
            case MovementDirection.Right:
                if (car.col + car.length - 1 < state.length - 1 && state[car.row][car.col + car.length] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(state)) as number[][];
                    newGrid[car.row].fill(0, car.col, car.col + car.length);
                    newGrid[car.row].fill(step.carId, car.col + 1, car.col + 1 + car.length);
                    return newGrid;
                }
                return;
            case MovementDirection.Up:
                if (car.row > 0  && state[car.row - 1][car.col] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(state)) as number[][];
                    for (let i = car.row; i < car.row + car.length; i++) newGrid[i][car.col] = 0;
                    for (let i = car.row - 1; i < (car.row-1) + car.length; i++) newGrid[i][car.col] = step.carId;
                    return newGrid;
                }
                return;
            case MovementDirection.Down:
                if (car.row + car.length - 1 < state.length - 1  && state[car.row + car.length][car.col] === 0) {
                    const newGrid = JSON.parse(JSON.stringify(state)) as number[][];
                    for (let i = car.row; i < car.row + car.length; i++) newGrid[i][car.col] = 0;
                    for (let i = car.row + 1; i < (car.row+1) + car.length; i++) newGrid[i][car.col] = step.carId;
                    return newGrid;
                }
                return;
            default:
                return;
        }
    }

    getAllMovesFromState(state: number[][]) {
        const moves = []
        const carIds = [];
        const cars: Car[] = [];
        
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state.length; j++) {
                if (state[i][j] !== 0 && !carIds.includes(state[i][j])) {
                    carIds.push(state[i][j]);                    
                }
            }
        }

        for (const id of carIds) {
            cars.push(this.findCar(id, state))
        }

        for (const car of cars) {
            if (car.orientation == 'horizontal') {
                const moveLeft = this.moveCar({carId: car.id, direction: MovementDirection.Left}, state);
                if (moveLeft) {
                    moves.push(moveLeft);
                }

                const moveRight = this.moveCar({carId: car.id, direction: MovementDirection.Right}, state);
                if (moveRight) {
                    moves.push(moveRight);
                }
            }

            if (car.orientation == 'vertical') {
                const moveUp = this.moveCar({carId: car.id, direction: MovementDirection.Up}, state);
                if (moveUp) {
                    moves.push(moveUp);
                }

                const moveDown = this.moveCar({carId: car.id, direction: MovementDirection.Down}, state);
                if (moveDown) {
                    moves.push(moveDown);
                }
            }
        }
        return moves;
    }

    solve(initState: number[][]): number[][] {
        // implement bfs
        // explore all possible nodes (node = new grid config)
        const visited = new Set<string>();
        const queue = [[initState, []]];
        visited.add(JSON.stringify(initState));

        while (queue.length > 0) {
            const [state, step] = queue.shift();
            if (this.isSolved(state)) {
                return step;
            }

            const nextMoves = this.getAllMovesFromState(state);
            for (const move of nextMoves) {
                if (!visited.has(JSON.stringify(move))) {
                    visited.add(JSON.stringify(move));
                    queue.push([move, [...step, move]]);
                }
            }
        }
        return;
    }
}