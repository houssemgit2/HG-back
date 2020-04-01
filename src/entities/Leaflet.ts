import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { LeafletPeriod } from "./LeafletPeriod";

@Index("leaflet_period_id_1_fk", ["periodId"], {})
@Entity("leaflet", { schema: "hg_promo_beta" })
export class Leaflet {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "period_id" })
  periodId: number;

  @Column("float", { name: "price", precision: 12 })
  price: number;

  @Column("varchar", { name: "lab", length: 64 })
  lab: string;

  @Column("varchar", { name: "libelle", length: 64 })
  libelle: string;

  @Column("varchar", { name: "gamme", length: 64 })
  gamme: string;

  @Column("int", { name: "contenance" })
  contenance: number;

  @Column("varchar", { name: "cond_el", length: 50 })
  condEl: string;

  @Column("varchar", { name: "unit", length: 25 })
  unit: string;

  @Column("int", { name: "qte_lot", nullable: true })
  qteLot: number | null;

  @Column("varchar", { name: "url_order", length: 100 })
  urlOrder: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  updatedAt: Date;

  @ManyToOne(
    () => LeafletPeriod,
    leafletPeriod => leafletPeriod.leaflets,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "period_id", referencedColumnName: "id" }])
  period: LeafletPeriod;
}
