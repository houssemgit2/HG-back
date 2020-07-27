import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RejectionReasonValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.status === 'true' || value.status === 1) {
      value.status = true;
    }
    if (value.status === 'false' || value.status === 0) {
      value.status = false;
    }
    return value;
  }
}
