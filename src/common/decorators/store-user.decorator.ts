import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStoreIdOrAdmin implements ValidatorConstraintInterface {
  

  async validate(value: any, args: ValidationArguments) {
    console.log('new decorators------------------<', args);
    return false; // return false if the desired element exist
  }
}

export function IsValidStoreId(
  validationOptions?: ValidationOptions,
  //   repository?: { entityName: string; entity: any; key: string },
) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStoreIdOrAdmin,
    });
  };
}
