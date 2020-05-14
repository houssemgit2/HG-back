import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsArrayOfObject(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsArrayOfObject',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            Array.isArray(value) &&
            value.some(
              item =>
                item.allow &&
                // typeof item.store_cip === 'number' &&
                typeof item.resource === 'number',
            )
          );
        },
      },
    });
  };
}
