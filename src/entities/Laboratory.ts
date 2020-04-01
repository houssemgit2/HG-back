import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "./Brand";

@Entity("laboratory", { schema: "hg_promo_beta" })
export class Laboratory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 256 })
  name: string;

  @OneToMany(
    () => Brand,
    brand => brand.laboratory
  )
  brands: Brand[];
}
