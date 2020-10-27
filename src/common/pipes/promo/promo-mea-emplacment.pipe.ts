import { arrayEquals } from '../../utils/helpers';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PromoMeaEmplacementValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (
      value.remuneration_fixed_details &&
      value.remuneration_fixed_details.has_emplacement &&
      !arrayEquals(
        value.remuneration_fixed_details.data_emplacement.map(
          item => item.emplacement_type_id,
        ),
        value.promo_mea_emplacements.map(item => item.emplacement_type_id),
      )
    ) {
      throw new BadRequestException(
        `Remuneration emplacement should be the same emplacement you select in the Emplacement details in the previous step`,
      );
    }
    return value;
  }
}
