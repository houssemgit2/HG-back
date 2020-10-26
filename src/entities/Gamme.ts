import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

import { Brand } from './Brand';
import { Product } from './Product';
import { Promo } from './Promo';

@Index('gamme_brand_id_fk', ['brandId'], {})
@Entity('gamme', { schema: 'hg_promo_beta' })
export class Gamme extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'brand_id' })
  brandId: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @ManyToOne(
    () => Brand,
    brand => brand.gammes,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'brand_id', referencedColumnName: 'id' }])
  brand: Brand;

  @OneToMany(
    () => Product,
    product => product.gamme,
  )
  products: Product[];

  @OneToMany(
    () => Promo,
    promo => promo.gamme,
  )
  promos: Promo[];
}
