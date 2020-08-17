import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Promo } from "./Promo";
import { AchatAdvantageDiscountType } from "./AchatAdvantageDiscountType";

@Index("fkIdx_428", ["promoId"], {})
@Index("fkIdx_475", ["achatAdvantageDiscountTypeId"], {})
@Entity("promo_achat", { schema: "hg_promo_beta" })
export class PromoAchat {
  @Column("int", { primary: true, name: "promo_id" })
  promoId: number;

  @Column("int", { name: "achat_advantage_discount_type_id" })
  achatAdvantageDiscountTypeId: number;

  @Column("json", { name: "eligibility_ca_details" })
  eligibilityCaDetails: object;

  @Column("json", { name: "eligibility_volume" })
  eligibilityVolume: object;

  @Column("text", { name: "eligibility_other" })
  eligibilityOther: string;

  @Column("json", { name: "eligibility_franco" })
  eligibilityFranco: object;

  @Column("text", { name: "eligibility_additional_information" })
  eligibilityAdditionalInformation: string;

  @Column("json", { name: "achat_advantage_discount_details" })
  achatAdvantageDiscountDetails: object;

  @OneToOne(() => Promo, (promo) => promo.promoAchat, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "promo_id", referencedColumnName: "id" }])
  promo: Promo;

  @ManyToOne(
    () => AchatAdvantageDiscountType,
    (achatAdvantageDiscountType) => achatAdvantageDiscountType.promoAchats,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "achat_advantage_discount_type_id", referencedColumnName: "id" },
  ])
  achatAdvantageDiscountType: AchatAdvantageDiscountType;
}
