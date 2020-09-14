import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { EmplacementType } from './EmplacementType';
import { PromoMea } from './PromoMea';

@Index('fkIdx_349', ['emplacementTypeId'], {})
@Index('fkIdx_424', ['promoId'], {})
@Entity('promo_mea_emplacement', { schema: 'hg_promo_beta' })
export class PromoMeaEmplacement {
  @Column('int', { primary: true, name: 'promo_id' })
  promoId: number;

  @Column('int', { primary: true, name: 'emplacement_type_id' })
  emplacementTypeId: number;

  @Column('text', { name: 'details' })
  details: string;

  @ManyToOne(
    () => EmplacementType,
    emplacementType => emplacementType.promoMeaEmplacements,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', eager: true },
  )
  @JoinColumn([{ name: 'emplacement_type_id', referencedColumnName: 'id' }])
  emplacementType: EmplacementType;

  @ManyToOne(
    () => PromoMea,
    promoMea => promoMea.promoMeaEmplacements,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    },
  )
  @JoinColumn([{ name: 'promo_id', referencedColumnName: 'promoId' }])
  promo: PromoMea;
}
