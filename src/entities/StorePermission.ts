import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Store } from "./Store";

@Index("store_permission_store_id_fk", ["storeId"], {})
@Entity("store_permission", { schema: "hg_promo_beta" })
export class StorePermission {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "store_id" })
  storeId: number;

  @Column("varchar", { name: "resource", length: 64 })
  resource: string;

  @Column("tinyint", { name: "allow", nullable: true, width: 1 })
  allow: boolean | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP"
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => Store,
    store => store.storePermissions,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "store_id", referencedColumnName: "id" }])
  store: Store;
}
