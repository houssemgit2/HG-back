import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { RejectionReason } from '../../entities/RejectionReason';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RejectionReasonValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.reason) {
      return getConnection()
        .createQueryBuilder()
        .select('rejection')
        .from(RejectionReason, 'rejection')
        .where(`name = :reason`, {
          reason: value.reason,
        })
        .getOne()
        .catch(e => {
          throw new InternalServerErrorException(e);
        })
        .then(data => {
          if (!data)
            throw new BadRequestException(
              'The reason you provided is not register',
            );
          value['reason_id'] = data.id;
          return value;
        });
    }
    return value;
  }
}
