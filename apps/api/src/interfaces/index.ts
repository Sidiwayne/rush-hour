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
