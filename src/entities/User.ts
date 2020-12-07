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
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { RefreshToken } from './RefreshToken';
import { Store } from './Store';
import { UserRole } from './UserRole';

@Index('user_store_id_fk', ['storeId'], {})
@Index('user_user_role_id_fk', ['userRoleId'], {})
@Entity('user', { schema: 'hg_promo_beta' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'store_id' })
  storeId: number;

  @Column('boolean', { name: 'is_owner', select: true })
  isOwner: number;

  @Column('int', { name: 'user_role_id' })
  userRoleId: number;

  @Column('varchar', { name: 'first_name', length: 255 })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 255 })
  lastName: string;

  @Column('varchar', { name: 'password', length: 255, select: false })
  password: string;

  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Column('varchar', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Column('varchar', { name: 'address', length: 255 })
  address: string;

  @Column('varchar', { name: 'salt', length: 255, select: false })
  salt: string;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(
    () => RefreshToken,
    refreshToken => refreshToken.user,
  )
  refreshTokens: RefreshToken[];

  @OneToOne(
    () => Store,
    store => store.owner,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @ManyToOne(
    () => Store,
    store => store.users,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }])
  store: Store;
  @OneToOne(
    () => Store,
    store => store.owner,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  myStore: Store;
  @ManyToOne(
    () => UserRole,
    userRole => userRole.users,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'user_role_id', referencedColumnName: 'id' }])
  userRole: UserRole;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
  transform(): void {
    if (this.password) delete this.password;
    if (this.salt) delete this.salt;
  }
}
