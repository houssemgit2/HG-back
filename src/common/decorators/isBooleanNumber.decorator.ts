import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBooleanNumber(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isBooleanNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log('IsBooleanNumber', value);
          const isValid =
            (typeof value === 'number' && (value === 0 || value === 1)) ||
            typeof value === 'boolean' ||
            typeof JSON.parse(value) === 'boolean';
          return isValid;
        },
      },
    });
  };
}
