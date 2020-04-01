import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity
} from "typeorm";
import { User } from "./User";

@Index('refresh_token_user_id_fk', ['userId'], {})
@Entity('refresh_token', { schema: 'hg_promo_beta' })
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'token', length: 255 })
  token: string;

  @Column('varchar', { name: 'user_email', length: 255 })
  userEmail: string;

  @Column('datetime', { name: 'expires' })
  expires: Date;

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
    () => User,
    user => user.refreshTokens,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
