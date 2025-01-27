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

export interface Step {
    carId: number;
    direction: MovementDirection;
}

export interface MoveOutCome {
    currentMoveMinStep: number;
    previousMoveMinStep: number;
}