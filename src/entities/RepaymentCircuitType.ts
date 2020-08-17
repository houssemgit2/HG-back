import { Column, Entity, OneToMany } from "typeorm";
import { PromoMea } from "./PromoMea";

@Entity("repayment_circuit_type", { schema: "hg_promo_beta" })
export class RepaymentCircuitType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @OneToMany(() => PromoMea, (promoMea) => promoMea.repaymentCircuitType)
  promoMeas: PromoMea[];
}
