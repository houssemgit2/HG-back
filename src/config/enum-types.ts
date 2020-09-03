import { DocumentProvideType } from 'src/entities/DocumentProvideType';
import { EligibilityFrancoType } from 'src/entities/EligibilityFrancoType';
import { EmplacementType } from 'src/entities/EmplacementType';
import { EqualConditionType } from 'src/entities/EqualConditionType';
import { OperationType } from 'src/entities/OperationType';
import { RemunerationBaseType } from 'src/entities/RemunerationBaseType';
import { RemunerationCaAnnualPlateType } from 'src/entities/RemunerationCaAnnualPlateType';
import { RemunerationCaAnnualTargetType } from 'src/entities/RemunerationCaAnnualTargetType';
import { RemunerationFixedType } from 'src/entities/RemunerationFixedType';
import { RepaymentCircuitType } from 'src/entities/RepaymentCircuitType';
import { PromoConcernedType } from '../entities/PromoConcernedType';
import { PromoStatus } from '../entities/Status';
import { MeasureType } from '../entities/MeasureType';

export enum promoState {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  TO_JUSTIFY = 'TO_JUSTIFY',
  PENDING = 'PENDING',
  NOT_JUSTIFIED = 'NOT_JUSTIFIED',
  OPERATION_REFUSED = 'OPERATION_REFUSED',
  UNJUSTIFIED = 'UNJUSTIFIED',
}
export const STATIC_TABLES = [
  {
    name: 'ca_target',
    targetEntity: RemunerationCaAnnualTargetType,
    entityName: 'RemunerationCaAnnualTargetType',
  },
  {
    name: 'remuneration-fixed',
    targetEntity: RemunerationFixedType,
    entityName: 'RemunerationFixedType',
  },
  {
    name: 'ca-plate',
    targetEntity: RemunerationCaAnnualPlateType,
    entityName: 'RemunerationCaAnnualPlateType',
  },
  {
    name: 'remuneration-base',
    targetEntity: RemunerationBaseType,
    entityName: 'RemunerationBaseType',
  },
  {
    name: 'emplacement',
    targetEntity: EmplacementType,
    entityName: 'EmplacementType',
  },
  {
    name: 'operations-types',
    targetEntity: OperationType,
    entityName: 'OperationType',
  },
  {
    name: 'comparison-types',
    targetEntity: EqualConditionType,
    entityName: 'EqualConditionType',
  },
  {
    name: 'repayment-circuits',
    targetEntity: RepaymentCircuitType,
    entityName: 'RepaymentCircuitType',
  },
  {
    name: 'proof-types',
    targetEntity: DocumentProvideType,
    entityName: 'DocumentProvideType',
  },
  ,
  {
    name: 'concerned-type',
    targetEntity: PromoConcernedType,
    entityName: 'PromoConcernedType',
  },
  {
    name: 'franco-type',
    targetEntity: EligibilityFrancoType,
    entityName: 'EligibilityFrancoType', //promo_status
  },
  {
    name: 'promo-status',
    targetEntity: PromoStatus,
    entityName: 'PromoStatus', //promo_status
  },
  {
    name: 'measure-type',
    targetEntity: MeasureType,
    entityName: 'MeasureType', //promo_status
  },
];
