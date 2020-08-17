import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";

@Index("AK1_customer_customerName", ["customerName"], { unique: true })
@Entity("customer", { schema: "hg_promo_beta" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "int", name: "customerId" })
  customerId: number;

  @Column("varchar", { name: "customerName", unique: true, length: 40 })
  customerName: string;

  @Column("varchar", { name: "Phone", nullable: true, length: 20 })
  phone: string | null;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
