import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Order } from "./Order";

@Index("FK_orderItem_orderId_order", ["orderId"], {})
@Entity("orderItem", { schema: "hg_promo_beta" })
export class OrderItem {
  @Column("int", { primary: true, name: "orderId" })
  orderId: number;

  @Column("decimal", { name: "unitPrice", precision: 12, scale: 2 })
  unitPrice: string;

  @Column("int", { name: "quantity" })
  quantity: number;

  @OneToOne(() => Order, (order) => order.orderItem, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "orderId", referencedColumnName: "orderId" }])
  order: Order;
}
