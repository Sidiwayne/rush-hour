import { IsNotEmpty, Validate } from "class-validator";
import { ValidateLength } from "../validators";

export class Board {
    id: number;

    @Validate(ValidateLength, [6])
    @IsNotEmpty()
    matrix: number[][];
}