import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RejectionReasonValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.state === 'REJECTED' && !value.reason) {
      throw new BadRequestException('rejection promo must has reason');
    }
    return value;
  }
}
