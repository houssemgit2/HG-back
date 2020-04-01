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
const Leaflet_1 = require("./Leaflet");
let LeafletPeriod = class LeafletPeriod {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], LeafletPeriod.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "calendar_period" }),
    __metadata("design:type", Number)
], LeafletPeriod.prototype, "calendarPeriod", void 0);
__decorate([
    typeorm_1.Column("int", { name: "year" }),
    __metadata("design:type", Number)
], LeafletPeriod.prototype, "year", void 0);
__decorate([
    typeorm_1.Column("int", { name: "enabled" }),
    __metadata("design:type", Number)
], LeafletPeriod.prototype, "enabled", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], LeafletPeriod.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], LeafletPeriod.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Leaflet_1.Leaflet, leaflet => leaflet.period),
    __metadata("design:type", Array)
], LeafletPeriod.prototype, "leaflets", void 0);
LeafletPeriod = __decorate([
    typeorm_1.Entity("leaflet_period", { schema: "hg_promo_beta" })
], LeafletPeriod);
exports.LeafletPeriod = LeafletPeriod;
//# sourceMappingURL=LeafletPeriod.js.map