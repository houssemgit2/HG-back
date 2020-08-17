import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ressource", { schema: "hg_promo_beta" })
export class Ressource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;
}
