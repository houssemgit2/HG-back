import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JsonValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    Object.keys(value).forEach(key => {
      if (key.includes('status')) value[key] = JSON.parse(value[key]);
    });
    return value;
  }
}
