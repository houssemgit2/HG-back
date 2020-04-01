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
let EligibilityCondition = class EligibilityCondition {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], EligibilityCondition.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "promo_id" }),
    __metadata("design:type", Number)
], EligibilityCondition.prototype, "promoId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "quantity", nullable: true }),
    __metadata("design:type", Number)
], EligibilityCondition.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column("tinyint", { name: "has_condition", width: 1 }),
    __metadata("design:type", Boolean)
], EligibilityCondition.prototype, "hasCondition", void 0);
__decorate([
    typeorm_1.Column("float", { name: "price_min", precision: 12 }),
    __metadata("design:type", Number)
], EligibilityCondition.prototype, "priceMin", void 0);
__decorate([
    typeorm_1.Column("float", { name: "price_max", precision: 12 }),
    __metadata("design:type", Number)
], EligibilityCondition.prototype, "priceMax", void 0);
__decorate([
    typeorm_1.Column("tinyint", { name: "is_variegated", width: 1 }),
    __metadata("design:type", Boolean)
], EligibilityCondition.prototype, "isVariegated", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promo_1.Promo, promo => promo.eligibilityConditions, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "promo_id", referencedColumnName: "id" }]),
    __metadata("design:type", Promo_1.Promo)
], EligibilityCondition.prototype, "promo", void 0);
EligibilityCondition = __decorate([
    typeorm_1.Index("eligibility_condition_promo_id_fk", ["promoId"], {}),
    typeorm_1.Entity("eligibility_condition", { schema: "hg_promo_beta" })
], EligibilityCondition);
exports.EligibilityCondition = EligibilityCondition;
//# sourceMappingURL=EligibilityCondition.js.map