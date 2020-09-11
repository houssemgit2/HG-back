import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { PromoGeneralPromoDto } from '../../../promo/dto/promo-general.dto';
import { validate } from 'class-validator';

@Injectable()
export class PromoValidationPipe implements PipeTransform<any> {
  async transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      const groups: string[] = [];
      if (value && value.start_date && value.end_date) {
        if (
          value.start_date === 'Invalid date' ||
          value.end_date === 'Invalid date'
        )
          throw new BadRequestException('Invalid date');
        const startDate = moment(value.start_date, 'DD-MM-YYYY').valueOf();
        const endDate = moment(value.end_date, 'DD-MM-YYYY').valueOf();
        if (startDate >= endDate) {
          console.log('diff ********');
          console.log(startDate, '-----', endDate);
          throw new BadRequestException(
            'End Date must be bigger than start date',
          );
        }
        if (value.promo_concern_type_id === 1) {
          if (value.product)
            throw new BadRequestException(
              'Product property is not allowed in this typeof promo',
            );
          if (
            value.product_concern_type_id === 1 &&
            (value.product_ids || value.new_products)
          ) {
            throw new BadRequestException(
              'products list  is not allowed in this typeof promo',
            );
          }
        }
      }

      const entityClass = plainToClass(PromoGeneralPromoDto, value, { groups });
      const errors = await validate(entityClass, { groups });

      if (errors.length > 0) {
        console.log(errors);
        throw new BadRequestException(
          errors.map(item => JSON.stringify(item.constraints)),
        );
      }
    }
    return value;
  }
}
