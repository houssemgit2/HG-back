import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupportFile } from './SupportFile';

@Index('user_id', ['id'], {})
@Index('support_user_id_fk', ['userId'], {})
@Entity('support', { schema: 'hg_promo_beta_old_structure' })
export class Support {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'concerned_module', length: 255 })
  concernedModule: string;

  @Column('varchar', { name: 'comment', length: 255 })
  comment: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('varchar', { name: 'browser', length: 255 })
  browser: string;

  @Column('varchar', { name: 'sent_to', length: 64 })
  sentTo: string;

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

  @Column('varchar', { name: 'contact', nullable: true, length: 255 })
  contact: string | null;

  @Column('int', { name: 'phone_num', nullable: true })
  phoneNum: number | null;

  @OneToMany(
    () => SupportFile,
    supportFile => supportFile.support,
  )
  supportFiles: SupportFile[];
}
