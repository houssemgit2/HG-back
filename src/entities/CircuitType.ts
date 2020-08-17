import { Column, Entity, OneToMany } from "typeorm";
import { PromoConso } from "./PromoConso";

@Entity("circuit_type", { schema: "hg_promo_beta" })
export class CircuitType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @OneToMany(() => PromoConso, (promoConso) => promoConso.circuitType)
  promoConsos: PromoConso[];
}
