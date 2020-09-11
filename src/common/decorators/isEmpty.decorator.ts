import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// export function IsEmptyIf(
//   condition?: (object: any, value: any) => boolean,
//   validationOptions?: ValidationOptions,
// ) {
//   return function(object: Record<string, any>, propertyName: string) {
//     const args: ValidationMetadataArgs = {
//       type: ValidationTypes.CONDITIONAL_VALIDATION,
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [
//         (object: any, value: any) => {
//           if (typeof condition === 'function') {
//             if (!condition(object, value)) {
//               return true;
//             }
//           }
//           return object[propertyName] === undefined;
//         },
//       ],

//       validationOptions:
//         typeof condition === 'object' ? condition : validationOptions,
//     };
//     getFromContainer(MetadataStorage).addValidationMetadata(
//       new ValidationMetadata(args),
//     );
//   };
// }

export function IsEmptyIf(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsEmptyIf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof condition === 'function') {
            if (!condition(object, value)) {
              return true;
            }

            const isValid =
              value === undefined || value === null || value === '';
            return isValid;
          }
          return true;
        },
      },
    });
  };
}
