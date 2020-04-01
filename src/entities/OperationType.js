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
const PromoType_1 = require("./PromoType");
let OperationType = class OperationType {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], OperationType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 256 }),
    __metadata("design:type", String)
], OperationType.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => PromoType_1.PromoType, promoType => promoType.operationType),
    __metadata("design:type", Array)
], OperationType.prototype, "promoTypes", void 0);
OperationType = __decorate([
    typeorm_1.Entity("operation_type", { schema: "hg_promo_beta" })
], OperationType);
exports.OperationType = OperationType;
//# sourceMappingURL=OperationType.js.map