import { Column, Entity, OneToMany } from "typeorm";
import { MicroType } from "./MicroType";

@Entity("macro_type", { schema: "hg_promo_beta" })
export class MacroType {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @OneToMany(() => MicroType, (microType) => microType.macroType)
  microTypes: MicroType[];
}
