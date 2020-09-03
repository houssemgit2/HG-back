import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { STATIC_TABLES } from 'src/config/enum-types';

@Injectable()
export class SelectValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.field) {
      const selectedTable = STATIC_TABLES.find(
        item => item && item.name === value.field,
      );
      value.entityName = selectedTable.entityName;
      value.targetEntity = selectedTable.targetEntity;
    }

    return value;
  }
}
