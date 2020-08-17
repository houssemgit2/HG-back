import { Column, Entity } from "typeorm";

@Entity("eligibility_ca_range_type", { schema: "hg_promo_beta" })
export class EligibilityCaRangeType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 128 })
  name: string;
}
