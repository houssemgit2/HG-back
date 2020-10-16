import { DocumentProvideType } from '../../entities/DocumentProvideType';
import { EligibilityFrancoType } from '../../entities/EligibilityFrancoType';
import { EmplacementType } from '../../entities/EmplacementType';
import { EqualConditionType } from '../../entities/EqualConditionType';
import { MeasureType } from '../../entities/MeasureType';
import { OperationType } from '../../entities/OperationType';
import { ProductConcernType } from '../../entities/ProductConcernType';
import { PromoConcernType } from '../../entities/PromoConcernedType';
import { RejectionReason } from '../../entities/RejectionReason';
import { RemunerationBaseType } from '../../entities/RemunerationBaseType';
import { RemunerationCaAnnualPlateType } from '../../entities/RemunerationCaAnnualPlateType';
import { RemunerationCaAnnualTargetType } from '../../entities/RemunerationCaAnnualTargetType';
import { RemunerationFixedType } from '../../entities/RemunerationFixedType';
import { RepaymentCircuitType } from '../../entities/RepaymentCircuitType';
import { Resource } from '../../entities/Resource';
import { PromoStatus } from '../../entities/Status';

export enum PROMO_STATE {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  TO_JUSTIFY = 'TO_JUSTIFY',
  PENDING = 'PENDING',
  NOT_JUSTIFIED = 'NOT_JUSTIFIED',
  OPERATION_REFUSED = 'OPERATION_REFUSED',
  UNJUSTIFIED = 'UNJUSTIFIED',
}
export enum PROMO_STATE_ID {
  TO_JUSTIFY = 1,
  PENDING = 2,
  CONFIRMED = 3,
  REJECTED = 4,
  OPERATION_REFUSED = 5,
  NOT_JUSTIFIED = 6,
  UNJUSTIFIED = 7,
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
  {
    name: 'concerned-type',
    targetEntity: PromoConcernType,
    entityName: 'PromoConcernType',
  },
  {
    name: 'product-concern-type',
    targetEntity: ProductConcernType,
    entityName: 'ProductConcernType',
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
  {
    name: 'resources',
    targetEntity: Resource,
    entityName: 'Resource', //promo_status
  }, //RejectionReason
  {
    name: 'rejection-reasons',
    targetEntity: RejectionReason,
    entityName: 'RejectionReason', //promo_status
  }, //RejectionReason
];
