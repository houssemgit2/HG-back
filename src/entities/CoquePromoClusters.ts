import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cluster } from './Cluster';
import { CoquePromo } from './CoquePromo';

@Index('coque_promo_clusters_cluster_id_fk', ['clusterId'], {})
@Index('coque_promo_clusters_coque_pormo_id_fk', ['coquePromoId'], {})
@Entity('coque_promo_clusters', { schema: 'hg_promo_beta' })
export class CoquePromoClusters {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'coque_promo_id' })
  coquePromoId: number;

  @Column('int', { name: 'cluster_id' })
  clusterId: number;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(
    () => Cluster,
    cluster => cluster.coquePromoClusters,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },

  )
  @JoinColumn([{ name: 'cluster_id', referencedColumnName: 'id' }])
  cluster: Cluster;

  @ManyToOne(
    () => CoquePromo,
    coquePromo => coquePromo.coquePromoClusters,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },

  )
  @JoinColumn([{ name: 'coque_promo_id', referencedColumnName: 'id' }])
  coquePromo: CoquePromo;
}
