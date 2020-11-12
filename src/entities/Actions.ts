import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('user_id', ['id'], {})
@Index('actions_user_id_fk', ['userId'], {})
@Entity('actions')
export class Actions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'action_type', length: 255 })
  actionType: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'browser', length: 255 })
  browser: string;

  @Column('varchar', { name: 'ip', length: 255 })
  ip: string;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
