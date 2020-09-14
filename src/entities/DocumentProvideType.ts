import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { PromoMea } from './PromoMea';
import { PromoMeaDocumentProvide } from './PromoMeaDocumentProvide';

@Entity('document_provide_type', { schema: 'hg_promo_beta' })
export class DocumentProvideType {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @ManyToMany(
    () => PromoMea,
    promoMea => promoMea.documentProvideTypes,
  )
  promoMeas: PromoMea[];

  @OneToMany(
    () => PromoMeaDocumentProvide,
    promoMeaDocumentProvide => promoMeaDocumentProvide.documentProvideType,
  )
  promoMeaDocumentProvide: PromoMeaDocumentProvide[];
}
