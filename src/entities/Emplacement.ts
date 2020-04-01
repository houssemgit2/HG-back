import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Promo } from "./Promo";

@Index("emplacement_promo_id_fk", ["promoId"], {})
@Entity("emplacement", { schema: "hg_promo_beta" })
export class Emplacement {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "promo_id" })
  promoId: number;

  @ManyToOne(
    () => Promo,
    promo => promo.emplacements,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "promo_id", referencedColumnName: "id" }])
  promo: Promo;
}
