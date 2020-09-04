// todo to be deleted
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Index('eligibility_condition_promo_id_fk', ['promoId'], {})
@Entity('eligibility_condition', { schema: 'hg_promo_beta' })
export class EligibilityCondition extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'quantity', nullable: true })
  quantity: number | null;

  @Column('tinyint', { name: 'has_condition', width: 1 })
  hasCondition: boolean;

  @Column('float', { name: 'price_min', precision: 12 })
  priceMin: number;

  @Column('float', { name: 'price_max', precision: 12 })
  priceMax: number;

  @Column('tinyint', { name: 'is_variegated', width: 1 })
  isVariegated: boolean;

  // @ManyToOne(
  //   () => Promo,
  //   promo => promo.eligibilityConditions,
  //   { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  // )
  // @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  // promo: Promo;
}
