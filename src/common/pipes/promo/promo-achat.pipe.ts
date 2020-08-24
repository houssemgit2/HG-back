// PromoAchatValidationPipe

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PromoAchatDto } from '../../../promo/dto/promo.achat.dto';

@Injectable()
export class PromoAchatValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const groups: string[] = [];

    if (value.achat_advantage_discount_type_id === 1) {
      console.log('the actual group is euro');
      groups.push('euro');
    } else if (value.achat_advantage_discount_type_id === 2) {
      console.log('the actual group is freeUnit');

      groups.push('freeUnit');
    } else if (value.achat_advantage_discount_type_id === 2) {
      console.log('the actual group is percentage  ');

      groups.push('percentage');
      if (value.percentage_details.unity) {
        groups.push('unity');
        groups.push('unity-discount');
      }
      if (value.percentage_details.discount) {
        groups.push('discount');
        groups.push('unity-discount');
      }
    }
    console.log('GROUPS ----->', groups);
    const entityClass = plainToClass(PromoAchatDto, value, { groups });
    const errors = await validate(entityClass, {
      groups,
    });

    if (errors.length > 0) {
      console.log(errors);
      throw new BadRequestException(
        errors.map(item => JSON.stringify(item.constraints)),
      );
    }
    return value;
  }
}
