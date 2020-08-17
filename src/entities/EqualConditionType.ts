import { Column, Entity } from "typeorm";

@Entity("equal_condition_type", { schema: "hg_promo_beta" })
export class EqualConditionType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 128 })
  name: string;
}
