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
    if (value && typeof value.clusters === 'string')
      value.clusters = JSON.parse(value.clusters);
    else if (value && value.clusters && Array.isArray(value.clusters)) {
      const clusters = value.clusters.map(item => {
        return JSON.parse(item);
      });
      value.clusters = clusters;
    }
    if (value && typeof value.periods === 'string')
      value.periods = JSON.parse(value.periods);
    else if (value && value.periods && Array.isArray(value.periods)) {
      const periods = value.periods.map(item => {
        return JSON.parse(item);
      });
      value.periods = periods;
    }
    return value;
  }
}
