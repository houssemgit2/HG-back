import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Promo } from './Promo';
import { MicroType } from './MicroType';
import { CircuitType } from './CircuitType';
import { RemunerationBaseType } from './RemunerationBaseType';

@Index('fkIdx_375', ['promoId'], {})
@Index('fkIdx_379', ['microTypeId'], {})
@Index('fkIdx_389', ['circuitTypeId'], {})
@Index('fkIdx_397', ['remunerationBaseId'], {})
@Entity('promo_conso', { schema: 'hg_promo_beta' })
export class PromoConso {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'micro_type_id' })
  microTypeId: number;

  @Column('int', { name: 'circuit_type_id' })
  circuitTypeId: number;

  @Column('int', { name: 'remuneration_base_id' })
  remunerationBaseId: number;

  @Column('float', { name: 'price', precision: 12 })
  price: number;

  @Column('int', { name: 'quantity_lot' })
  quantityLot: number;

  @Column('tinyint', { name: 'physical_lot' })
  physicalLot: number;

  @OneToOne(
    () => Promo,
    promo => promo.promoConso,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;

  @ManyToOne(
    () => MicroType,
    microType => microType.promoConsos,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      eager: true,
    },
  )
  @JoinColumn([{ name: 'micro_type_id', referencedColumnName: 'id' }])
  microType: MicroType;

  @ManyToOne(
    () => CircuitType,
    circuitType => circuitType.promoConsos,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      eager: true,
    },
  )
  @JoinColumn([{ name: 'circuit_type_id', referencedColumnName: 'id' }])
  circuitType: CircuitType;

  @ManyToOne(
    () => RemunerationBaseType,
    remunerationBaseType => remunerationBaseType.promoConsos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'remuneration_base_id', referencedColumnName: 'id' }])
  remunerationBase: RemunerationBaseType;
}
