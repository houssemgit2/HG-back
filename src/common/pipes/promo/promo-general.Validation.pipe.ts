import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import * as moment from 'moment';

@Injectable()
export class PromoValidationPipe implements PipeTransform<any> {
  async transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      if (value && value.start_date && value.end_date) {
        if (
          value.start_date === 'Invalid date' ||
          value.end_date === 'Invalid date'
        )
          throw new BadRequestException('Invalid date');
        const startDate = moment(value.start_date, 'DD-MM-YYYY').valueOf();
        const endDate = moment(value.end_date, 'DD-MM-YYYY').valueOf();
        if (startDate > endDate) {
          // console.log('diff ********');
          // console.log(startDate, '-----', endDate);
          throw new BadRequestException(
            'End Date must be bigger than start date',
          );
        }
        if (value.promo_concern_type_id === 1) {
          if (value.product)
            delete value.product
          if (
            value.product_concern_type_id === 1
          ) {
            delete value.product_ids
            delete value.new_products
          }
        } else if (value.promo_concern_type_id === 2) {
          delete value.product_ids
          delete value.new_products
          delete value.product_concern_type_id
        }
      }
    }
    return value;
  }
}
