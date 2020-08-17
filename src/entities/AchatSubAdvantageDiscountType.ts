import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AchatAdvantageDiscountType } from "./AchatAdvantageDiscountType";

@Index("fkIdx_482", ["achatAdvantageDiscountTypeId"], {})
@Entity("achat_sub_advantage_discount_type", { schema: "hg_promo_beta" })
export class AchatSubAdvantageDiscountType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { name: "achat_advantage_discount_type_id" })
  achatAdvantageDiscountTypeId: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @ManyToOne(
    () => AchatAdvantageDiscountType,
    (achatAdvantageDiscountType) =>
      achatAdvantageDiscountType.achatSubAdvantageDiscountTypes,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "achat_advantage_discount_type_id", referencedColumnName: "id" },
  ])
  achatAdvantageDiscountType: AchatAdvantageDiscountType;
}
