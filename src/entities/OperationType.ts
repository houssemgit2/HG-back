import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PromoType } from "./PromoType";

@Entity("operation_type", { schema: "hg_promo_beta" })
export class OperationType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 256 })
  name: string;

  @OneToMany(
    () => PromoType,
    promoType => promoType.operationType
  )
  promoTypes: PromoType[];
}
