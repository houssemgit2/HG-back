import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  BaseEntity,
  AfterLoad,
} from 'typeorm';

import { Promo } from './Promo';
import { PromoMea } from './PromoMea';
import { RejectionReason } from './RejectionReason';
import { Store } from './Store';
import { StorePromoMeaStateType } from './StorePromoMeaStateType';

@Index('store_promo_mea_store_id_fk', ['storeId'], {})
@Index('store_promo_mea_promo_id_fk', ['promoId'], {})
@Index(
  'store_promo_mea_officine_rejected_reason_id_fk',
  ['officineRejectedReasonId'],
  {},
)
@Index(
  'store_promo_mea_siege_rejected_reason_id_fk',
  ['siegeRejectedReasonId'],
  {},
)
@Entity('store_promo_mea', { schema: 'hg_promo_beta' })
export class StorePromoMea extends BaseEntity {
  // @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  // id: number;

  @Column('int', { primary: true, name: 'store_id' })
  storeId: number;

  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { name: 'officine_rejected_reason_id' })
  officineRejectedReasonId: number;

  @Column('int', { name: 'siege_rejected_reason_id' })
  siegeRejectedReasonId: number;

  @Column('tinyint', {
    name: 'active',
    nullable: false,
    width: 1,
    default: () => 1,
  })
  active: boolean | null;

  @Column('int', {
    name: 'state_id',
    nullable: false,
    default: () => 1,
  })
  stateId: number;

  @Column('int', { name: 'rejection_number', default: () => "'2'" })
  rejectionNumber: number;

  @Column('varchar', { name: 'url_picture', nullable: true, length: 256 })
  urlPicture: string | null;

  @Column('varchar', { name: 'url_sells_listing', nullable: true, length: 256 })
  urlSellsListing: string | null;

  @Column('datetime', { name: 'uploaded_at', nullable: true })
  uploadedAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @AfterLoad()
  public loaded() {
    if (
      this.urlPicture &&
      this.urlPicture.includes(process.env.AWS_S3_BASE_URL)
    )
      this.urlPicture = process.env.AWS_S3_BASE_URL + this.urlPicture;
  }
  // @AfterUpdate()
  // updateState() {
  //   console.log('we are after update ---------------------->', this);
  //   if (this.state === PROMO_STATE.REJECTED && this.rejectionNumber > 0) {
  //     this.rejectionNumber = this.rejectionNumber - 1;
  //   }
  //   if (this.state === PROMO_STATE.REJECTED && this.rejectionNumber === 0) {
  //     this.state = 'OPERATION_REFUSED';
  //   }
  //   // this.save();
  // }

  @ManyToOne(
    () => RejectionReason,
    rejectionReason => rejectionReason.storePromoMeas,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([
    { name: 'officine_rejected_reason_id', referencedColumnName: 'id' },
  ])
  officineRejectedReason: RejectionReason;

  @ManyToOne(
    () => RejectionReason,
    rejectionReason => rejectionReason.storePromoMeas,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([
    { name: 'siege_rejected_reason_id', referencedColumnName: 'id' },
  ])
  siegeRejectedReason: RejectionReason;

  @ManyToOne(
    () => StorePromoMeaStateType,
    state => state.promos,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
  stateType: StorePromoMeaStateType;

  @ManyToOne(
    () => Store,
    store => store.storePromoMeas,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'store_id', referencedColumnName: 'cip' }])
  store: Store;

  @ManyToOne(
    () => Promo,
    promo => promo.storePromoMeas,
    { onDelete: 'NO ACTION', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;
}
