import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Promo } from './Promo';

@Entity('product_concern_type', { schema: 'hg_promo_beta' })
export class ProductConcernType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @OneToMany(
    () => Promo,
    promo => promo.productConcernTypeId,
  )
  promos: Promo[];
}
