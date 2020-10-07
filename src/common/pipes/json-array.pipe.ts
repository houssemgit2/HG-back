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
    if (value && value.clusters && Array.isArray(value.clusters)) {
      const clusters = value.clusters.map(item => {
        return JSON.parse(item);
      });
      value.clusters = clusters;
    }
    if (value && value.periods && Array.isArray(value.periods)) {
      const periods = value.periods.map(item => {
        return JSON.parse(item);
      });
      value.periods = periods;
    }
    return value;
  }
}
