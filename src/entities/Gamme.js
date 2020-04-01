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
const Brand_1 = require("./Brand");
const Product_1 = require("./Product");
const Promo_1 = require("./Promo");
let Gamme = class Gamme {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Gamme.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "brand_id" }),
    __metadata("design:type", Number)
], Gamme.prototype, "brandId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 256 }),
    __metadata("design:type", String)
], Gamme.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Brand_1.Brand, brand => brand.gammes, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "brand_id", referencedColumnName: "id" }]),
    __metadata("design:type", Brand_1.Brand)
], Gamme.prototype, "brand", void 0);
__decorate([
    typeorm_1.OneToMany(() => Product_1.Product, product => product.gamme),
    __metadata("design:type", Array)
], Gamme.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(() => Promo_1.Promo, promo => promo.gamme),
    __metadata("design:type", Array)
], Gamme.prototype, "promos", void 0);
Gamme = __decorate([
    typeorm_1.Index("gamme_brand_id_fk", ["brandId"], {}),
    typeorm_1.Entity("gamme", { schema: "hg_promo_beta" })
], Gamme);
exports.Gamme = Gamme;
//# sourceMappingURL=Gamme.js.map