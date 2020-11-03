import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Emplacement } from './Emplacement';
import { Gamme } from './Gamme';
import { Product } from './Product';
import { ProductConcernType } from './ProductConcernType';
import { PromoAchat } from './PromoAchat';
import { PromoCluster } from './PromoCluster';
import { PromoConcernType } from './PromoConcernedType';
import { PromoConso } from './PromoConso';
import { PromoMea } from './PromoMea';
import { PromoOperationType } from './PromoType';
import { PromoStatus } from './Status';
import { StorePromoMea } from './StorePromoMea';
import { StorePromoSelected } from './StorePromoSelected';

@Index('promo_gamme_id_fk', ['gammeId'], {})
@Index('promo_status_id_fk', ['statusId'], {})
@Index('promo_concern_id_fk', ['promoConcernTypeId'], {})
@Index('promo_product_concern_type_id_fk', ['productConcernTypeId'], {})
@Index('promo_product_ids_fk', ['productIds'], {})
@Entity('promo', { schema: 'hg_promo_beta' })
export class Promo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'gamme_id', nullable: true })
  gammeId: number | null;

  // @Column('int', { name: 'laboratory_id', nullable: true })
  // laboratoryId: number | null;

  @Column('date', { name: 'start_date', nullable: true })
  startDate: Date | null;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: Date | null;

  @Column('int', { name: 'status_id', nullable: true, default: 3 })
  statusId: number;

  @Column('int', { name: 'promo_concern_type_id', nullable: true })
  promoConcernTypeId: number;

  @Column('int', { name: 'product_concern_type_id', nullable: true })
  productConcernTypeId: number;

  @Column('json', { name: 'product_ids', nullable: true })
  productIds: object | null;

  @Column('text', { name: 'comment', nullable: true })
  comment: string;

  @CreateDateColumn({
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

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;

  // @OneToMany(
  //   () => EligibilityCondition,
  //   eligibilityCondition => eligibilityCondition.promo,
  // )
  // eligibilityConditions: EligibilityCondition[];

  @OneToMany(
    () => Emplacement,
    emplacement => emplacement.promo,
  )
  emplacements: Emplacement[];

  @ManyToOne(
    () => Gamme,
    gamme => gamme.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'gamme_id', referencedColumnName: 'id' }])
  gamme: Gamme;

  // @ManyToOne(
  //   () => Laboratory,
  //   laboratory => laboratory.promos,
  //   { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  // )
  // @JoinColumn([{ name: 'laboratory_id', referencedColumnName: 'id' }])
  // laboratory: Laboratory;

  @ManyToOne(
    () => PromoStatus,
    status => status.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'status_id', referencedColumnName: 'id' }])
  status: PromoStatus;

  @ManyToOne(
    () => PromoConcernType,
    promoConcernType => promoConcernType.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'promo_concern_type_id', referencedColumnName: 'id' }])
  promoConcernType: PromoConcernType;

  @ManyToOne(
    () => ProductConcernType,
    productConcernType => productConcernType.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'promo_concern_type_id', referencedColumnName: 'id' }])
  productConcernType: ProductConcernType;

  @OneToMany(
    () => PromoOperationType,
    promoType => promoType.promo,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promoType: PromoOperationType[];

  @ManyToOne(
    () => Product,
    promoProducts => promoProducts.promo,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
      // persistence: false,
      // primary: false,
      // lazy: true,
    },
  )
  @JoinColumn({ name: 'product_ids', referencedColumnName: 'id' })
  promoProducts: Product[];

  // @OneToMany(
  //   () => Remuneration,
  //   remuneration => remuneration.promo,
  // )
  // remunerations: Remuneration[];

  @OneToMany(
    () => StorePromoMea,
    storePromoMea => storePromoMea.promo,
  )
  storePromoMeas: StorePromoMea[];

  @OneToMany(
    () => StorePromoSelected,
    storePromoSelected => storePromoSelected.promo,
  )
  storePromoSelecteds: StorePromoSelected[];

  @OneToMany(
    () => PromoCluster,
    promoCluster => promoCluster.promo,
  )
  promoClusters: PromoCluster[];

  @OneToOne(
    () => PromoAchat,
    promoAchat => promoAchat.promo,
  )
  promoAchat: PromoAchat;

  @OneToOne(
    () => PromoConso,
    promoConso => promoConso.promo,
  )
  promoConso: PromoConso;

  @OneToOne(
    () => PromoMea,
    promoMea => promoMea.promo,
  )
  promoMea: PromoMea;
}
