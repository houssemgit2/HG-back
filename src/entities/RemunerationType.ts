import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Remuneration } from "./Remuneration";

@Entity('remuneration_type', { schema: 'hg_promo_beta' })
export class RemunerationType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 256 })
  name: string;

  @OneToMany(
    () => Remuneration,
    remuneration => remuneration.remunerationType,
  )
  remunerations: Remuneration[];
}
