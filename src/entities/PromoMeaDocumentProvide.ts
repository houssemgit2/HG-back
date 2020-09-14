import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { DocumentProvideType } from './DocumentProvideType';
import { Promo } from './Promo';

// @Index('promo_type_promo_id_fk', ['promoId'], {})
@Index('promo_mea_document_provide_type_id_fk', ['documentProvideTypeId'], {})
@Entity('promo_mea_document_provide', { schema: 'hg_promo_beta' })
export class PromoMeaDocumentProvide extends BaseEntity {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { primary: true, name: 'document_provide_type_id' })
  documentProvideTypeId: number;

  @ManyToOne(
    () => DocumentProvideType,
    documentProvideType => documentProvideType.promoMeaDocumentProvide,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'operation_type_id', referencedColumnName: 'id' }])
  documentProvideType: DocumentProvideType;

  @ManyToOne(
    () => Promo,
    promo => promo.promoType,
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }])
  promo: Promo;
}
