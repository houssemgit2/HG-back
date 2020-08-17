import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";

@Index("AK1_order_orderNumber", ["orderNumber"], { unique: true })
@Index("FK_order_customerId_customer", ["customerId"], {})
@Entity("order", { schema: "hg_promo_beta" })
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "orderId" })
  orderId: number;

  @Column("varchar", {
    name: "orderNumber",
    nullable: true,
    unique: true,
    length: 10,
  })
  orderNumber: string | null;

  @Column("int", { name: "customerId" })
  customerId: number;

  @Column("datetime", { name: "orderDate", default: () => "CURRENT_TIMESTAMP" })
  orderDate: Date;

  @Column("decimal", { name: "totalAmount", precision: 12, scale: 2 })
  totalAmount: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "customerId", referencedColumnName: "customerId" }])
  customer: Customer;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem;
}
