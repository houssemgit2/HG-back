import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { MacroType } from "./MacroType";
import { PromoConso } from "./PromoConso";

@Index("fkIdx_369", ["macroTypeId"], {})
@Entity("micro_type", { schema: "hg_promo_beta" })
export class MicroType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { name: "macro_type_id" })
  macroTypeId: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @ManyToOne(() => MacroType, (macroType) => macroType.microTypes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "macro_type_id", referencedColumnName: "id" }])
  macroType: MacroType;

  @OneToMany(() => PromoConso, (promoConso) => promoConso.microType)
  promoConsos: PromoConso[];
}
