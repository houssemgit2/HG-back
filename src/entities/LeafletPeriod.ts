import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Leaflet } from "./Leaflet";

@Entity('leaflet_period', { schema: 'hg_promo_beta' })
export class LeafletPeriod extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'calendar_period' })
  calendarPeriod: number;

  @Column('int', { name: 'year' })
  year: number;

  @Column('int', { name: 'enabled' })
  enabled: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => Leaflet,
    leaflet => leaflet.period,
  )
  leaflets: Leaflet[];
}
