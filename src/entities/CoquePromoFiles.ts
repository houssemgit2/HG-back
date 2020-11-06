import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoquePromo } from './CoquePromo';

@Index('coque_promo_files_coque_pormo_id_fk', ['coquePromoId'], {})
@Entity('coque_promo_files', { schema: 'hg_promo_beta' })
export class CoquePromoFiles {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'coque_promo_id' })
  coquePromoId: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'file_url', length: 255 })
  fileUrl: string;

  @Column('tinyint', { name: 'status', width: 1 })
  status: boolean;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(
    () => CoquePromo,
    coquePromo => coquePromo.coquePromoFiles,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'coque_promo_id', referencedColumnName: 'id' }])
  coquePromo: CoquePromo;
}
