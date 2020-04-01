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
const EmplacementType_1 = require("./EmplacementType");
const Promo_1 = require("./Promo");
const RemunerationType_1 = require("./RemunerationType");
let Remuneration = class Remuneration {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Remuneration.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "promo_id" }),
    __metadata("design:type", Number)
], Remuneration.prototype, "promoId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "remuneration_type_id" }),
    __metadata("design:type", Number)
], Remuneration.prototype, "remunerationTypeId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "emplacement_type_id" }),
    __metadata("design:type", Number)
], Remuneration.prototype, "emplacementTypeId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "price" }),
    __metadata("design:type", Number)
], Remuneration.prototype, "price", void 0);
__decorate([
    typeorm_1.Column("float", { name: "unity_max", precision: 12 }),
    __metadata("design:type", Number)
], Remuneration.prototype, "unityMax", void 0);
__decorate([
    typeorm_1.Column("float", { name: "unity_min", precision: 12 }),
    __metadata("design:type", Number)
], Remuneration.prototype, "unityMin", void 0);
__decorate([
    typeorm_1.ManyToOne(() => EmplacementType_1.EmplacementType, emplacementType => emplacementType.remunerations, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "emplacement_type_id", referencedColumnName: "id" }]),
    __metadata("design:type", EmplacementType_1.EmplacementType)
], Remuneration.prototype, "emplacementType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promo_1.Promo, promo => promo.remunerations, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "promo_id", referencedColumnName: "id" }]),
    __metadata("design:type", Promo_1.Promo)
], Remuneration.prototype, "promo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RemunerationType_1.RemunerationType, remunerationType => remunerationType.remunerations, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "remuneration_type_id", referencedColumnName: "id" }]),
    __metadata("design:type", RemunerationType_1.RemunerationType)
], Remuneration.prototype, "remunerationType", void 0);
Remuneration = __decorate([
    typeorm_1.Index("remuneration_remuneration_type_id_fk", ["remunerationTypeId"], {}),
    typeorm_1.Index("remuneration_emplacement_type_id_fk", ["emplacementTypeId"], {}),
    typeorm_1.Index("remuneration_promo_id_fk", ["promoId"], {}),
    typeorm_1.Entity("remuneration", { schema: "hg_promo_beta" })
], Remuneration);
exports.Remuneration = Remuneration;
//# sourceMappingURL=Remuneration.js.map