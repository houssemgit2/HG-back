import { Column, Entity } from "typeorm";

@Entity("remuneration_fixed_type", { schema: "hg_promo_beta" })
export class RemunerationFixedType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 128 })
  name: string;
}
