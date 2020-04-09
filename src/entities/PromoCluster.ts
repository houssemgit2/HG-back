import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { Promo } from './Promo';
import { Cluster } from './Cluster';

@Index('promo_cluster_promo_id_fk', ['promoId'], {})
@Index('promo_cluster_cluster_id_fk', ['clusterId'], {})
@Entity('promo_cluster', { schema: 'hg_promo_beta' })
export class PromoCluster extends BaseEntity {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'cluster_id' })
  clusterId: number;

  @ManyToOne(
    () => Cluster,
    cluster => cluster.promoClusters,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'cluster_id', referencedColumnName: 'id' }])
  cluster: Cluster;

  @ManyToOne(
    () => Promo,
    promo => promo.promoClusters,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;
}
