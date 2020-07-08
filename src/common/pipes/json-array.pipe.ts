import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Logger,
} from '@nestjs/common';

@Injectable()
export class JSONArrayValidation implements PipeTransform {
  logger = new Logger('JSON ARRAY VALIDATION');
  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.verbose('value before transform');
    console.log(value);
    if (value.clusters && Array.isArray(value.clusters)) {
      const clusters = value.clusters.map(item => {
        return JSON.parse(item);
      });
      value.clusters = clusters;
    }
    if (value.periods && Array.isArray(value.periods)) {
      const periods = value.periods.map(item => {
        return JSON.parse(item);
      });
      value.periods = periods;
    }
    this.logger.verbose('value after transform');
    console.log(value);
    return value;
  }
}
