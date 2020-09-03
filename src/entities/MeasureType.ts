import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Product } from './Product';

@Entity('measure_type', { schema: 'hg_promo_beta' })
export class MeasureType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @OneToMany(
    () => Product,
    product => product.measureTypeId,
  )
  products: Product[];
}
