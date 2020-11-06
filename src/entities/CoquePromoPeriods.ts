import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoquePromo } from './CoquePromo';

@Index('coque_promo_id', ['coquePromoId'], {})
@Entity('coque_promo_periods', { schema: 'hg_promo_beta' })
export class CoquePromoPeriods {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'coque_promo_id' })
  coquePromoId: number;

  @Column('int', { name: 'month' })
  month: number;

  @Column('int', { name: 'year' })
  year: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(
    () => CoquePromo,
    coquePromo => coquePromo.coquePromoPeriods,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'coque_promo_id', referencedColumnName: 'id' }])
  coquePromo: CoquePromo;
}
