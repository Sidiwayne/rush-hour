import { ApiProperty } from "@nestjs/swagger";

export enum MovementDirection {
    Up,
    Right,
    Down,
    Left
}

export interface Car {
    id: number;
    row: number;
    col: number;
    length: number;
    orientation: 'horizontal' | 'vertical';
}


export class Step  {
    @ApiProperty()
    carId: number ;
    @ApiProperty()
    direction: MovementDirection
};

export interface MoveOutCome {
    currentMoveMinStep: number;
    previousMoveMinStep: number;
}

interface RushHourSolver {
    /**
    * @notice Get solution for a rush hour puzzle.
    * @dev Should return empty array if the board has no solution.
    * @param board The six-by-six Rush Hour board with 0s indicating
    empty
    * spaces, and other numbers indicating cars. The manner in which
    * numbers are aligned equals the alignment of the cars.
    * @return An array with step-by-step instructions on how to get
    the
    * red car (denoted by 1s) out.
    */
    solve(board: number[][]): Step[];
}