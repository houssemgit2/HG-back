import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { StorePermission } from './StorePermission';

@Entity('resource', { schema: 'hg_promo_beta' })
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(
    () => StorePermission,
    storePermission => storePermission.resourceId,
  )
  storesPermission: StorePermission[];
}
