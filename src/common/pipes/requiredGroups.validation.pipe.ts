// PromoAchatValidationPipe

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class RequiredGroupsValidationPipe implements PipeTransform<any> {
  keyArray;
  group;
  dtoSchema;
  constructor(keyArray: string[], group: string, dtoSchema: any) {
    this.keyArray = keyArray;
    this.group = group;
    this.dtoSchema = dtoSchema;
  }
  async transform(value: any, metadata: ArgumentMetadata) {
    const groups: string[] = [];

    const dto = metadata;

    this.keyArray.forEach(element => {
      if (value[element]) groups.push(this.group);
    });
    console.log('GROUPS ----->', groups);
    const entityClass = plainToClass(this.dtoSchema, value, { groups });
    const errors = await validate(entityClass, {
      groups,
    });
    if (errors.length > 0) {
      console.log(errors);
      throw new BadRequestException(
        errors.map(item => JSON.stringify(item.constraints)),
      );
    }
    return value;
  }
}
