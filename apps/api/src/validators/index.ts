import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint()
export class ValidateLength implements ValidatorConstraintInterface {
  validate(matrix: number[][], args: ValidationArguments) {
    return matrix.length === args.constraints[0] && matrix.every((m) => m.length === args.constraints[0]);
  }

  defaultMessage(args: ValidationArguments) {
    return 'matrix should be 6x6';
  }
}