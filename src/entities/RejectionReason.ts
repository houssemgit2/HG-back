import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StorePromoMea } from "./StorePromoMea";

@Entity("rejection_reason", { schema: "hg_promo_beta" })
export class RejectionReason {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 256 })
  name: string;

  @OneToMany(
    () => StorePromoMea,
    storePromoMea => storePromoMea.rejectedReason
  )
  storePromoMeas: StorePromoMea[];
}
