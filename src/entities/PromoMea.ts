import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Promo } from './Promo';
import { RepaymentCircuitType } from './RepaymentCircuitType';
import { DocumentProvideType } from './DocumentProvideType';
import { PromoMeaEmplacement } from './PromoMeaEmplacement';

@Index('fkIdx_415', ['promoId'], {})
@Index('fkIdx_459', ['repaymentCircuitTypeId'], {})
@Entity('promo_mea', { schema: 'hg_promo_beta' })
export class PromoMea {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'repayment_circuit_type_id' })
  repaymentCircuitTypeId: number;

  @Column('tinyint', { name: 'has_eligibility_minimum_order' })
  hasEligibilityMinimumOrder: boolean;

  @Column('json', { name: 'eligibility_minimum_details' })
  eligibilityMinimumDetails: object;

  @Column('tinyint', { name: 'has_eligibility_ca_range' })
  hasEligibilityCaRange: boolean;

  @Column('json', { name: 'eligibility_ca_range_details' })
  eligibilityCaRangeDetails: object;

  @Column('tinyint', { name: 'has_eligibility_other' })
  hasEligibilityOther: boolean;

  @Column('json', { name: 'eligibility_other_details' })
  eligibilityOtherDetails: string;

  @Column('tinyint', { name: 'emplacement_plv_labo' })
  emplacementPlvLabo: boolean;

  @Column('tinyint', { name: 'has_remuneration_unit_product' })
  hasRemunerationUnitProduct: boolean;

  @Column('json', { name: 'remuneration_unit_product_details' })
  remunerationUnitProductDetails: object;

  @Column('tinyint', { name: 'has_remuneration_fixed' })
  hasRemunerationFixed: boolean;

  @Column('json', { name: 'remuneration_fixed_details' })
  remunerationFixedDetails: object;

  @Column('tinyint', { name: 'has_remuneration_ca_annual' })
  hasRemunerationCaAnnual: boolean;

  @Column('json', { name: 'remuneration_ca_annual_details' })
  remunerationCaAnnualDetails: object;

  @Column('tinyint', { name: 'has_remuneration_other' })
  hasRemunerationOther: boolean;

  @Column('text', { name: 'remuneration_other_details' })
  remunerationOtherDetails: string;

  @Column('tinyint', { name: 'has_promo_conso_linked' })
  hasPromoConsoLinked: boolean;

  @Column('tinyint', { name: 'has_promo_achat_linked' })
  hasPromoAchatLinked: boolean;

  @OneToOne(
    () => Promo,
    promo => promo.promoMea,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;

  @ManyToOne(
    () => RepaymentCircuitType,
    repaymentCircuitType => repaymentCircuitType.promoMeas,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([
    { name: 'repayment_circuit_type_id', referencedColumnName: 'id' },
  ])
  repaymentCircuitType: RepaymentCircuitType;

  @ManyToMany(
    () => DocumentProvideType,
    documentProvideType => documentProvideType.promoMeas,
  )
  @JoinTable({
    name: 'promo_mea_document_provide',
    joinColumns: [{ name: 'promo_id', referencedColumnName: 'promoId' }],
    inverseJoinColumns: [
      { name: 'document_provide_type_id', referencedColumnName: 'id' },
    ],
    schema: 'hg_promo_beta',
  })
  documentProvideTypes: DocumentProvideType[];

  @OneToMany(
    () => PromoMeaEmplacement,
    promoMeaEmplacement => promoMeaEmplacement.promo,
  )
  promoMeaEmplacements: PromoMeaEmplacement[];
}
