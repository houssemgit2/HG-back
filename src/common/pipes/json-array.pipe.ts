import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JSONArrayValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
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
    return value;
  }
}
