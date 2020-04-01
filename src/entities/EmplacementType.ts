import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Remuneration } from "./Remuneration";

@Entity("emplacement_type", { schema: "hg_promo_beta" })
export class EmplacementType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "name" })
  name: number;

  @OneToMany(
    () => Remuneration,
    remuneration => remuneration.emplacementType
  )
  remunerations: Remuneration[];
}
