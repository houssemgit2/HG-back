import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { User } from './User';

@Entity('user_role', { schema: 'hg_promo_beta' })
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(
    () => User,
    user => user.userRole,
  )
  users: User[];
}
