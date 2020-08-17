import { Column, Entity } from "typeorm";

@Entity("remuneration_ca_annual_plate_type", { schema: "hg_promo_beta" })
export class RemunerationCaAnnualPlateType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 128 })
  name: string;
}
