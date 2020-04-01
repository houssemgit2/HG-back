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
const Promo_1 = require("./Promo");
let Emplacement = class Emplacement {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Emplacement.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "promo_id" }),
    __metadata("design:type", Number)
], Emplacement.prototype, "promoId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promo_1.Promo, promo => promo.emplacements, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "promo_id", referencedColumnName: "id" }]),
    __metadata("design:type", Promo_1.Promo)
], Emplacement.prototype, "promo", void 0);
Emplacement = __decorate([
    typeorm_1.Index("emplacement_promo_id_fk", ["promoId"], {}),
    typeorm_1.Entity("emplacement", { schema: "hg_promo_beta" })
], Emplacement);
exports.Emplacement = Emplacement;
//# sourceMappingURL=Emplacement.js.map