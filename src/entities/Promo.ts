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
  JoinTable,
} from 'typeorm';
import { EligibilityCondition } from './EligibilityCondition';
import { Emplacement } from './Emplacement';
import { Gamme } from './Gamme';
import { PromoType } from './PromoType';
import { Remuneration } from './Remuneration';
import { StorePromoMea } from './StorePromoMea';
import { StorePromoSelected } from './StorePromoSelected';
import { PromoCluster } from './PromoCluster';
import { PromoAchat } from './PromoAchat';
import { PromoConso } from './PromoConso';
import { PromoMea } from './PromoMea';
import { ManyToMany } from 'typeorm';
import { OperationType } from './OperationType';

@Index('promo_gamme_id_fk', ['gammeId'], {})
@Entity('promo', { schema: 'hg_promo_beta' })
export class Promo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'gamme_id', nullable: true })
  gammeId: number | null;

  @Column('date', { name: 'start_date', nullable: true })
  startDate: Date | null;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: Date | null;

  @Column('int', { name: 'offer_advantage_client', nullable: true })
  offerAvantageClient: number;

  @Column('json', { name: 'products_id_in', nullable: true })
  productsIdIn: object | null;

  @Column('json', { name: 'products_id_out', nullable: true })
  productsIdOut: object | null;

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

  @OneToMany(
    () => EligibilityCondition,
    eligibilityCondition => eligibilityCondition.promo,
  )
  eligibilityConditions: EligibilityCondition[];

  @OneToMany(
    () => Emplacement,
    emplacement => emplacement.promo,
  )
  emplacements: Emplacement[];

  @ManyToOne(
    () => Gamme,
    gamme => gamme.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'gamme_id', referencedColumnName: 'id' }])
  gamme: Gamme;

  @OneToMany(
    () => PromoType,
    promoType => promoType.promo,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promoType: PromoType[];

  @OneToMany(
    () => Remuneration,
    remuneration => remuneration.promo,
  )
  remunerations: Remuneration[];

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
