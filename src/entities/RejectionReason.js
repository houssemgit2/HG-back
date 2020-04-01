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
const StorePromoMea_1 = require("./StorePromoMea");
let RejectionReason = class RejectionReason {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], RejectionReason.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 256 }),
    __metadata("design:type", String)
], RejectionReason.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePromoMea_1.StorePromoMea, storePromoMea => storePromoMea.rejectedReason),
    __metadata("design:type", Array)
], RejectionReason.prototype, "storePromoMeas", void 0);
RejectionReason = __decorate([
    typeorm_1.Entity("rejection_reason", { schema: "hg_promo_beta" })
], RejectionReason);
exports.RejectionReason = RejectionReason;
//# sourceMappingURL=RejectionReason.js.map