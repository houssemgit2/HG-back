import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Laboratory } from './Laboratory';
import { Gamme } from './Gamme';

@Index('brand_laboratory_id_fk', ['laboratoryId'], {})
@Entity('brand', { schema: 'hg_promo_beta' })
export class Brand {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'laboratory_id' })
  laboratoryId: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @ManyToOne(
    () => Laboratory,
    laboratory => laboratory.brands,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'laboratory_id', referencedColumnName: 'id' }])
  laboratory: Laboratory;

  @OneToMany(
    () => Gamme,
    gamme => gamme.brand,
  )
  gammes: Gamme[];
}
