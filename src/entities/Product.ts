import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Gamme } from './Gamme';

@Index('product_gamme_id_fk', ['gammeId'], {})
@Index('product_measure_type_id_fk', ['measureTypeId'], {})
@Entity('product', { schema: 'hg_promo_beta' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'ean' })
  ean: number;

  @Column('int', { name: 'gamme_id' })
  gammeId: number;

  @Column('int', { name: 'measure_type_id' })
  measureTypeId: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('tinyint', { name: 'is_lot', width: 1 })
  isLot: boolean;

  @Column('int', { name: 'quantity_lot' })
  quantityLot: number;

  @Column('float', { name: 'measure_value' })
  measureValue: number;

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
    () => Gamme,
    gamme => gamme.products,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'gamme_id', referencedColumnName: 'id' }])
  gamme: Gamme;
}
