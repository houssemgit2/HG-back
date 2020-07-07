import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Store } from './Store';
import { PromoCluster } from './PromoCluster';
import { CoquePromoClusters } from './CoquePromoClusters';

@Entity('cluster', { schema: 'hg_promo_beta' })
export class Cluster extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @OneToMany(
    () => Store,
    store => store.clusters,
  )
  stores: Store[];
  @OneToMany(
    () => PromoCluster,
    promoCluster => promoCluster.cluster,
  )
  promoClusters: PromoCluster[];

  @OneToMany(
    () => CoquePromoClusters,
    coquePromoClusters => coquePromoClusters.cluster,
  )
  coquePromoClusters: CoquePromoClusters[];
}
