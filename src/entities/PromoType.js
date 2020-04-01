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
const OperationType_1 = require("./OperationType");
const Promo_1 = require("./Promo");
let PromoType = class PromoType {
};
__decorate([
    typeorm_1.Column("int", { primary: true, name: "promo_id" }),
    __metadata("design:type", Number)
], PromoType.prototype, "promoId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "operation_type_id" }),
    __metadata("design:type", Number)
], PromoType.prototype, "operationTypeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OperationType_1.OperationType, operationType => operationType.promoTypes, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "operation_type_id", referencedColumnName: "id" }]),
    __metadata("design:type", OperationType_1.OperationType)
], PromoType.prototype, "operationType", void 0);
__decorate([
    typeorm_1.OneToOne(() => Promo_1.Promo, promo => promo.promoType, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "promo_id", referencedColumnName: "id" }]),
    __metadata("design:type", Promo_1.Promo)
], PromoType.prototype, "promo", void 0);
PromoType = __decorate([
    typeorm_1.Index("promo_type_promo_id_fk", ["promoId"], {}),
    typeorm_1.Index("promo_type_operation_type_id_fk", ["operationTypeId"], {}),
    typeorm_1.Entity("promo_type", { schema: "hg_promo_beta" })
], PromoType);
exports.PromoType = PromoType;
//# sourceMappingURL=PromoType.js.map