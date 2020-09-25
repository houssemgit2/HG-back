/* eslint-disable @typescript-eslint/camelcase */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import moment = require('moment');

@Injectable()
export class DatesListValidationPipe implements PipeTransform {
  logger = new Logger('Validation Dates');
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.constructor.name !== 'ListMeaDto') return value;
    if (value && !(value.month && value.year) && !value.dates_list) {
      // throw new BadRequestException(
      //   'month and year or dates list are required',
      // );
      return value; // TODO remove this return decomment error
    }
    if (value && value.dates_list) {
      this.logger.warn(
        `month: ${value.month} year: ${value.year} value.dates ${value.dates_list}`,
      );
      value.dates_list = Array.isArray(value.dates_list)
        ? value.dates_list.map(item => JSON.parse(item))
        : JSON.parse(value.dates_list);
      value.dates = Array.isArray(value.dates_list)
        ? this.fixDatesList(value.dates_list)
        : this.monthToStartEndDate(
            value.dates_list.month,
            value.dates_list.year,
          );
    } else if (value && value.month && value.year && !value.dates_list) {
      value.dates = this.monthToStartEndDate(value.month, value.year);
    }
    if (value) {
      value.end_date = value.dates.end_date;
      value.start_date = value.dates.start_date;
      delete value.dates;
    }
    return value;
  }
  private monthToStartEndDate(month: number, year: number): any {
    const start_date = moment()
      .year(year)
      .month(month)
      .startOf('month')
      .format('YYYY-MM-DD');
    const end_date = moment()
      .year(year)
      .month(month)
      .endOf('month')
      .format('YYYY-MM-DD');
    return { start_date, end_date };
  }
  private fixDatesList = dates_list => {
    let start_date, end_date;

    dates_list.map(item => {
      const dates = this.monthToStartEndDate(item.month, item.year);
      if (dates.start_date < start_date || !start_date)
        start_date = dates.start_date;
      if (dates.end_date > end_date || !end_date) end_date = dates.end_date;
      return true;
    });
    return { start_date, end_date };
  };
}
