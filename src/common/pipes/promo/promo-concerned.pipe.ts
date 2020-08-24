// import {
//   PipeTransform,
//   Injectable,
//   ArgumentMetadata,
//   BadRequestException,
// } from '@nestjs/common';
// import * as moment from 'moment';
// import { plainToClass } from 'class-transformer';
// import { validate } from 'class-validator';
// import { SaveGeneralPromoDto } from '../../../promo/dto/save-general-prams.dto';

// @Injectable()
// export class PromoConcernedValidationPipe implements PipeTransform<any> {
//   async transform(value: any, { metatype }: ArgumentMetadata) {
//     const groups = [];
//     if (value.concerned === 'gamme') groups.push('concerned_gamme');
//     if (value.concerned === 'product') groups.push('concerned_product');
//     //   if (value.concerned === 'product')
//     //   if (!value.option_product)
//     //     throw new BadRequestException(
//     //       `promo concerned ${value.concerned} must has an option product`,
//     //     );
//     // Transform to class with groups
//     const entityClass = plainToClass(SaveGeneralPromoDto, value, { groups });

//     // Validate with groups
//     const errors = await validate(entityClass, { groups });
//     if (errors.length > 0) {
//       throw new BadRequestException(errors);
//     }
//     return entityClass;
//   }
// }
