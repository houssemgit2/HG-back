/* eslint-disable @typescript-eslint/camelcase */
// PromoAchatValidationPipe

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PromoAchatDto } from '../../../promo/dto/promo.achat.dto';
import { PerCentAchatDiscountDto } from '../../../promo/dto/achat-advantage-discount-details.dto';
import { EligibilityDetailsDto } from '../../../promo/dto/eligibility-ca-details.dto';

@Injectable()
export class PromoAchatValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const groups: string[] = [];
    const errors = [];
    if (
      value.eligibility_ca_details &&
      Array.isArray(value.eligibility_ca_details)
    ) {
      value.eligibility_ca_details.forEach(async element => {
        const eligibilityGroups: string[] = [];
        if (element.equal_condition_type_id == 1) {
          eligibilityGroups.push('between');
        }
        if (
          element.equal_condition_type_id == 2 ||
          element.equal_condition_type_id == 3
        ) {
          eligibilityGroups.push('greaterThan');
        }
        if (
          element.equal_condition_type_id == 4 ||
          element.equal_condition_type_id == 5
        ) {
          eligibilityGroups.push('lessThan');
        }
        const entityClass = plainToClass(EligibilityDetailsDto, element, {
          groups: eligibilityGroups,
        });
        const eligibilityErrors = await validate(entityClass, {
          groups: eligibilityGroups,
        });
        if (eligibilityErrors.length) errors.push(...eligibilityErrors);
      });
    }
    if (
      value.achat_advantage_discount_details &&
      value.achat_advantage_discount_details
        .achat_advantage_discount_type_id === 1
    ) {
      console.log('the actual group is euro');
      groups.push('euro');
    } else if (
      value.achat_advantage_discount_details &&
      value.achat_advantage_discount_details
        .achat_advantage_discount_type_id === 3
    ) {
      console.log('the actual group is freeUnit');

      groups.push('freeUnit');
    } else if (
      value.achat_advantage_discount_details &&
      value.achat_advantage_discount_details
        .achat_advantage_discount_type_id === 2
    ) {
      console.log('the actual group is percentage  ');

      groups.push('percentage');
      if (value.percentage_details && Array.isArray(value.percentage_details)) {
        value.percentage_details.foreach(async item => {
          const percentageGroup: string[] = [];
          if (item.unity) {
            percentageGroup.push('unity');
            percentageGroup.push('unity-discount');
          }
          if (item.discount) {
            percentageGroup.push('discount');
            percentageGroup.push('unity-discount');
          }
          const entityClass = plainToClass(PerCentAchatDiscountDto, item, {
            groups: percentageGroup,
          });
          const percentageErrors = await validate(entityClass, {
            groups: percentageGroup,
          });
          if (percentageErrors.length) errors.push(...percentageErrors);
        });
      }
    }
    console.log('GROUPS ----->', groups);
    const entityClass = plainToClass(PromoAchatDto, value, { groups });
    const otherErrors = await validate(entityClass, {
      groups,
    });
    if (otherErrors.length) errors.push(...otherErrors);
    if (errors.length > 0) {
      console.log(errors);
      throw new BadRequestException(
        errors.map(item => JSON.stringify(item.constraints)),
      );
    }
    if (value.achat_advantage_discount_details) {
      value.achat_advantage_discount_type_id =
        value.achat_advantage_discount_details.achat_advantage_discount_type_id;
      if (groups.includes('euro'))
        value.achat_advantage_discount_details =
          value.achat_advantage_discount_details.euro_details;
      if (groups.includes('freeUnit'))
        value.achat_advantage_discount_details =
          value.achat_advantage_discount_details.free_unit_details;
      if (groups.includes('percentage'))
        value.achat_advantage_discount_details =
          value.achat_advantage_discount_details.percentage_details;
    }
    return value;
  }
}
