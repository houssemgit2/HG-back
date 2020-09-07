import { Column, Entity, OneToMany } from 'typeorm';
import { PromoConso } from './PromoConso';
// import { Remuneration } from './Remuneration';

@Entity('remuneration_base_type', { schema: 'hg_promo_beta' })
export class RemunerationBaseType {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  // @OneToMany(
  //   () => Remuneration,
  //   remuneration => remuneration.remunerationBaseType,
  // )
  // remunerations: Remuneration[];

  @OneToMany(
    () => PromoConso,
    promoConso => promoConso.remunerationBase,
  )
  promoConsos: PromoConso[];
}
