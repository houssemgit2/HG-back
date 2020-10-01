import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

import { Promo } from './Promo';
import { StorePromoMea } from './StorePromoMea';

@Entity('store_promo_mea_state_type', { schema: 'hg_promo_beta' })
export class StorePromoMeaStateType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @OneToMany(
    () => StorePromoMea,
    promo => promo.stateType,
  )
  promos: Promo[];
}
