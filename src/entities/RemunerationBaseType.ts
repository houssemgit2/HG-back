import { Column, Entity, OneToMany } from "typeorm";
import { PromoConso } from "./PromoConso";

@Entity("remuneration_base_type", { schema: "hg_promo_beta" })
export class RemunerationBaseType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @OneToMany(() => PromoConso, (promoConso) => promoConso.remunerationBase)
  promoConsos: PromoConso[];
}
