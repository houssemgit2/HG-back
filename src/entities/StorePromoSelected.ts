import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Promo } from './Promo';
import { Store } from './Store';

@Index('store_promo_selected_store_id_fk', ['storeId'], {})
@Index('store_promo_selected_promo_id_fk', ['promoId'], {})
@Entity('store_promo_selected', { schema: 'hg_promo_beta' })
export class StorePromoSelected extends BaseEntity {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'store_id' })
  storeId: number;

  @Column('int', { name: 'year' })
  year: number;

  @Column('int', { name: 'month' })
  month: number;

  @Column('json', { name: 'print_config', nullable: true })
  printConfig: any | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => Promo,
    promo => promo.storePromoSelecteds,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;

  @ManyToOne(
    () => Store,
    store => store.storePromoSelecteds,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;
}
