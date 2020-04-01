import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Gamme } from "./Gamme";

@Index("product_gamme_id_fk", ["gammeId"], {})
@Entity("product", { schema: "hg_promo_beta" })
export class Product {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "ean" })
  ean: number;

  @Column("int", { name: "gamme_id" })
  gammeId: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => Gamme,
    gamme => gamme.products,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "gamme_id", referencedColumnName: "id" }])
  gamme: Gamme;
}
