import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { OperationType } from './OperationType';
import { Promo } from './Promo';

@Index('promo_type_promo_id_fk', ['promoId'], {})
@Index('promo_type_operation_type_id_fk', ['operationTypeId'], {})
@Entity('promo_operation_type', { schema: 'hg_promo_beta' })
export class PromoOperationType extends BaseEntity {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { primary: true, name: 'operation_type_id' })
  operationTypeId: number;

  @ManyToOne(
    () => OperationType,
    operationType => operationType.promoTypes,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'operation_type_id', referencedColumnName: 'id' }])
  operationType: OperationType;

  @ManyToOne(
    () => Promo,
    promo => promo.promoType,
    // { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;
}
