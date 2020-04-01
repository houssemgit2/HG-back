import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Store } from './Store';

@Entity('cluster', { schema: 'hg_promo_beta' })
export class Cluster extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @OneToMany(
    () => Store,
    store => store.cluster,
  )
  stores: Store[];
}
