import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { Cluster } from './Cluster';
import { StorePermission } from './StorePermission';
import { StorePromoMea } from './StorePromoMea';
import { StorePromoSelected } from './StorePromoSelected';
import { User } from './User';

@Index('store_cluster_id_fk', ['clusterId'], {})
@Entity('store', { schema: 'hg_promo_beta' })
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'cluster_id' })
  clusterId: number;

  @Column('int', { name: 'cip' })
  cip: number;

  @Column('varchar', { name: 'name', length: 132 })
  name: string;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => Cluster,
    cluster => cluster.stores,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'cluster_id', referencedColumnName: 'id' }])
  clusters: Cluster;

  @OneToMany(
    () => StorePermission,
    storePermission => storePermission.store,
  )
  storePermissions: StorePermission[];

  @OneToMany(
    () => StorePromoMea,
    storePromoMea => storePromoMea.store,
  )
  storePromoMeas: StorePromoMea[];

  @OneToMany(
    () => StorePromoSelected,
    storePromoSelected => storePromoSelected.store,
  )
  storePromoSelecteds: StorePromoSelected[];

  @OneToMany(
    () => User,
    user => user.store,
  )
  users: User[];

  @OneToOne(
    () => User,
    user => user.id,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'cip', referencedColumnName: 'id' }])
  owner: User;
}
