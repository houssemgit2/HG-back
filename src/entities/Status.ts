import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Promo } from './Promo';

@Entity('promo_status', { schema: 'hg_promo_beta' })
export class PromoStatus extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @OneToMany(
    () => Promo,
    promo => promo.status,
  )
  promos: Promo[];
}
