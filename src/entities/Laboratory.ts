import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Brand } from './Brand';
import { Promo } from './Promo';

@Entity('laboratory', { schema: 'hg_promo_beta' })
export class Laboratory extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @OneToMany(
    () => Brand,
    brand => brand.laboratory,
  )
  brands: Brand[];
}
