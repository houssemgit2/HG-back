import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CoquePromoClusters } from "./CoquePromoClusters";
import { CoquePromoFiles } from "./CoquePromoFiles";
import { CoquePromoPeriods } from "./CoquePromoPeriods";

@Entity("coque_promo", { schema: "hg_promo_beta" })
export class CoquePromo {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("tinyint", { name: "status", width: 100,default:1 })
  status: boolean;

  @Column("timestamp", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updatedAt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(
    () => CoquePromoClusters,
    (coquePromoClusters) => coquePromoClusters.coquePromo
  )
  coquePromoClusters: CoquePromoClusters[];

  @OneToMany(
    () => CoquePromoFiles,
    (coquePromoFiles) => coquePromoFiles.coquePromo
  )
  coquePromoFiles: CoquePromoFiles[];

  @OneToMany(
    () => CoquePromoPeriods,
    (coquePromoPeriods) => coquePromoPeriods.coquePromo
  )
  coquePromoPeriods: CoquePromoPeriods[];
}
