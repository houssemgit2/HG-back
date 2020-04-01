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
const EligibilityCondition_1 = require("./EligibilityCondition");
const Emplacement_1 = require("./Emplacement");
const Gamme_1 = require("./Gamme");
const PromoType_1 = require("./PromoType");
const Remuneration_1 = require("./Remuneration");
const StorePromoMea_1 = require("./StorePromoMea");
const StorePromoSelected_1 = require("./StorePromoSelected");
let Promo = class Promo {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Promo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "gamme_id" }),
    __metadata("design:type", Number)
], Promo.prototype, "gammeId", void 0);
__decorate([
    typeorm_1.Column("date", { name: "start_date", nullable: true }),
    __metadata("design:type", String)
], Promo.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column("date", { name: "end_date", nullable: true }),
    __metadata("design:type", String)
], Promo.prototype, "endDate", void 0);
__decorate([
    typeorm_1.Column("json", { name: "products_id_in", nullable: true }),
    __metadata("design:type", Object)
], Promo.prototype, "productsIdIn", void 0);
__decorate([
    typeorm_1.Column("json", { name: "products_id_out", nullable: true }),
    __metadata("design:type", Object)
], Promo.prototype, "productsIdOut", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Promo.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Promo.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => EligibilityCondition_1.EligibilityCondition, eligibilityCondition => eligibilityCondition.promo),
    __metadata("design:type", Array)
], Promo.prototype, "eligibilityConditions", void 0);
__decorate([
    typeorm_1.OneToMany(() => Emplacement_1.Emplacement, emplacement => emplacement.promo),
    __metadata("design:type", Array)
], Promo.prototype, "emplacements", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Gamme_1.Gamme, gamme => gamme.promos, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "gamme_id", referencedColumnName: "id" }]),
    __metadata("design:type", Gamme_1.Gamme)
], Promo.prototype, "gamme", void 0);
__decorate([
    typeorm_1.OneToOne(() => PromoType_1.PromoType, promoType => promoType.promo),
    __metadata("design:type", PromoType_1.PromoType)
], Promo.prototype, "promoType", void 0);
__decorate([
    typeorm_1.OneToMany(() => Remuneration_1.Remuneration, remuneration => remuneration.promo),
    __metadata("design:type", Array)
], Promo.prototype, "remunerations", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePromoMea_1.StorePromoMea, storePromoMea => storePromoMea.promo),
    __metadata("design:type", Array)
], Promo.prototype, "storePromoMeas", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePromoSelected_1.StorePromoSelected, storePromoSelected => storePromoSelected.promo),
    __metadata("design:type", Array)
], Promo.prototype, "storePromoSelecteds", void 0);
Promo = __decorate([
    typeorm_1.Index("promo_gamme_id_fk", ["gammeId"], {}),
    typeorm_1.Entity("promo", { schema: "hg_promo_beta" })
], Promo);
exports.Promo = Promo;
//# sourceMappingURL=Promo.js.map