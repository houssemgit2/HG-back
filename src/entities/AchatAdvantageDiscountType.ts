// import { Column, Entity, OneToMany } from 'typeorm';
import { Entity, Column, OneToMany } from 'typeorm';
import { AchatSubAdvantageDiscountType } from './AchatSubAdvantageDiscountType';
import { PromoAchat } from './PromoAchat';

@Entity('achat_advantage_discount_type', { schema: 'hg_promo_beta' })
export class AchatAdvantageDiscountType {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(
    () => AchatSubAdvantageDiscountType,
    achatSubAdvantageDiscountType =>
      achatSubAdvantageDiscountType.achatAdvantageDiscountType,

    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  achatSubAdvantageDiscountTypes: AchatSubAdvantageDiscountType[];

  @OneToMany(
    () => PromoAchat,
    promoAchat => promoAchat.achatAdvantageDiscountType,
  )
  promoAchats: PromoAchat[];
}
