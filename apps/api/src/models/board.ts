import { IsNotEmpty, Validate } from "class-validator";
import { ValidateLength } from "../validators";
import { ApiProperty } from "@nestjs/swagger";

export class Board {
    @ApiProperty()
    id: number;

    @Validate(ValidateLength, [6])
    @IsNotEmpty()
    @ApiProperty({
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'number',
            },
        },
    })
    matrix: number[][];
}