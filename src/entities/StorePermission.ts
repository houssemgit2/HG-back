import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Store } from './Store';
import { Resource } from './resource';

@Index('store_permission_store_id_fk', ['storeId'], {})
@Index('store_permission_resource_id_fk', ['resourceId'], {})
@Entity('store_permission', { schema: 'hg_promo_beta' })
export class StorePermission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'store_id' })
  storeId: number;

  @Column('int', { name: 'resource_id' })
  resourceId: number;

  @Column('tinyint', { name: 'allow', nullable: true, width: 1 })
  allow: number | null;

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
    () => Store,
    store => store.storePermissions,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;

  @ManyToOne(
    () => Resource,
    resource => resource.storesPermission,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'id' }])
  resource: Resource;
}
