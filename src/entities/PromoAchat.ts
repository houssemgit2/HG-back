import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Promo } from './Promo';
import { AchatAdvantageDiscountType } from './AchatAdvantageDiscountType';
import {
  IAchatAdvantageDiscountDetails,
  IEligibilityCaDetails,
  IEligibilityFranco,
  IEligibilityVolume,
} from '../promo/interface/achat.interface';

@Index('fkIdx_428', ['promoId'], {})
@Index('fkIdx_475', ['achatAdvantageDiscountTypeId'], {})
@Entity('promo_achat', { schema: 'hg_promo_beta' })
export class PromoAchat {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'achat_advantage_discount_type_id' })
  achatAdvantageDiscountTypeId: number;

  @Column('json', { name: 'eligibility_ca_details' })
  eligibilityCaDetails: IEligibilityCaDetails;

  @Column('json', { name: 'eligibility_volume' })
  eligibilityVolume: IEligibilityVolume;
  @Column('text', { name: 'eligibility_other' })
  eligibilityOther: string;

  @Column('json', { name: 'eligibility_franco' })
  eligibilityFranco: IEligibilityFranco;

  @Column('text', { name: 'eligibility_additional_information' })
  eligibilityAdditionalInformation: string;

  @Column('json', { name: 'achat_advantage_discount_details' })
  achatAdvantageDiscountDetails: IAchatAdvantageDiscountDetails;

  @OneToOne(
    () => Promo,
    promo => promo.promoAchat,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;

  @ManyToOne(
    () => AchatAdvantageDiscountType,
    achatAdvantageDiscountType => achatAdvantageDiscountType.promoAchats,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([
    { name: 'achat_advantage_discount_type_id', referencedColumnName: 'id' },
  ])
  achatAdvantageDiscountType: AchatAdvantageDiscountType;
}
