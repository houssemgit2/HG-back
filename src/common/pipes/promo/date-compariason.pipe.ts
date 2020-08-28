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
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type === 'body') {
      const groups: string[] = [];
      if (value && value.start_date && value.end_date) {
        if (
          value.start_date === 'Invalid date' ||
          value.end_date === 'Invalid date'
        )
          throw new BadRequestException('Invalid date');
        //   const diff =
        //     new Date(value.end_date).getTime() -
        //     new Date(value.start_date).getTime();
        const startDate = moment(value.start_date, 'DD-MM-YYYY').valueOf();
        const endDate = moment(value.end_date, 'DD-MM-YYYY').valueOf();
        if (startDate >= endDate) {
          console.log('diff ********');
          console.log(startDate, '-----', endDate);
          throw new BadRequestException(
            'End Date must be bigger than start date',
          );
        }
      }
      if (value.concerned === 'gamme') {
        groups.push('concerned_gamme');
        if (value.option_product === 'all') groups.push('all_product');
        if (value.option_product === 'some') groups.push('some_product');
        if (value.option_product === 'exclude') groups.push('exclude_product');
      } else if (value.concerned === 'product') {
        groups.push('concerned_product');
        if (value.lot === false) groups.push('without_lot');
        if (value.lot === true) groups.push('with_lot');
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
    // value = { ...value, groups };
    return value;
  }
}
