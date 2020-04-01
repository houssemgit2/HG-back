import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./Store";

@Entity("cluster", { schema: "hg_promo_beta" })
export class Cluster {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @OneToMany(
    () => Store,
    store => store.cluster
  )
  stores: Store[];
}
