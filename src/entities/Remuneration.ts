// todo to be deleted
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { EmplacementType } from './EmplacementType';
import { Promo } from './Promo';
import { RemunerationBaseType } from './RemunerationBaseType';

@Index('remuneration_remuneration_type_id_fk', ['remunerationTypeId'], {})
@Index('remuneration_emplacement_type_id_fk', ['emplacementTypeId'], {})
@Index('remuneration_promo_id_fk', ['promoId'], {})
@Entity('remuneration', { schema: 'hg_promo_beta' })
export class Remuneration extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'remuneration_type_id' })
  remunerationTypeId: number;

  @Column('int', { name: 'emplacement_type_id' })
  emplacementTypeId: number;

  @Column('int', { name: 'price' })
  price: number;

  @Column('float', { name: 'unity_max', precision: 12 })
  unityMax: number;

  @Column('float', { name: 'unity_min', precision: 12 })
  unityMin: number;

  @ManyToOne(
    () => EmplacementType,
    emplacementType => emplacementType.remunerations,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'emplacement_type_id', referencedColumnName: 'id' }])
  emplacementType: EmplacementType;

  // @ManyToOne(
  //   () => Promo,
  //   promo => promo.remunerations,
  //   { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  // )
  // @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  // promo: Promo;

  @ManyToOne(
    () => RemunerationBaseType,
    RemunerationBaseType => RemunerationBaseType.remunerations,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'remuneration_type_id', referencedColumnName: 'id' }])
  remunerationBaseType: RemunerationBaseType;
}
