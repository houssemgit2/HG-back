"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const LeafletPeriod_1 = require("./LeafletPeriod");
let Leaflet = class Leaflet {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Leaflet.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "period_id" }),
    __metadata("design:type", Number)
], Leaflet.prototype, "periodId", void 0);
__decorate([
    typeorm_1.Column("float", { name: "price", precision: 12 }),
    __metadata("design:type", Number)
], Leaflet.prototype, "price", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "lab", length: 64 }),
    __metadata("design:type", String)
], Leaflet.prototype, "lab", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "libelle", length: 64 }),
    __metadata("design:type", String)
], Leaflet.prototype, "libelle", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "gamme", length: 64 }),
    __metadata("design:type", String)
], Leaflet.prototype, "gamme", void 0);
__decorate([
    typeorm_1.Column("int", { name: "contenance" }),
    __metadata("design:type", Number)
], Leaflet.prototype, "contenance", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "cond_el", length: 50 }),
    __metadata("design:type", String)
], Leaflet.prototype, "condEl", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "unit", length: 25 }),
    __metadata("design:type", String)
], Leaflet.prototype, "unit", void 0);
__decorate([
    typeorm_1.Column("int", { name: "qte_lot", nullable: true }),
    __metadata("design:type", Number)
], Leaflet.prototype, "qteLot", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "url_order", length: 100 }),
    __metadata("design:type", String)
], Leaflet.prototype, "urlOrder", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Leaflet.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Leaflet.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => LeafletPeriod_1.LeafletPeriod, leafletPeriod => leafletPeriod.leaflets, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "period_id", referencedColumnName: "id" }]),
    __metadata("design:type", LeafletPeriod_1.LeafletPeriod)
], Leaflet.prototype, "period", void 0);
Leaflet = __decorate([
    typeorm_1.Index("leaflet_period_id_1_fk", ["periodId"], {}),
    typeorm_1.Entity("leaflet", { schema: "hg_promo_beta" })
], Leaflet);
exports.Leaflet = Leaflet;
//# sourceMappingURL=Leaflet.js.map