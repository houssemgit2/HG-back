import { Column, Entity } from "typeorm";

@Entity("eligibility_franco_type", { schema: "hg_promo_beta" })
export class EligibilityFrancoType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 128 })
  name: string;
}
