import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Support } from "./Support";

@Index("support_id", ["supportId"], {})
@Entity("support_file", { schema: "hg_promo_beta_old_structure" })
export class SupportFile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "support_id" })
  supportId: number;

  @Column("varchar", { name: "url_file", length: 255 })
  urlFile: string;

  @ManyToOne(() => Support, (support) => support.supportFiles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "support_id", referencedColumnName: "id" }])
  support: Support;
}
