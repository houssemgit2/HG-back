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
const Store_1 = require("./Store");
let StorePromoSelected = class StorePromoSelected {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], StorePromoSelected.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "promo_id" }),
    __metadata("design:type", Number)
], StorePromoSelected.prototype, "promoId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "store_id" }),
    __metadata("design:type", Number)
], StorePromoSelected.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "year" }),
    __metadata("design:type", Number)
], StorePromoSelected.prototype, "year", void 0);
__decorate([
    typeorm_1.Column("int", { name: "month" }),
    __metadata("design:type", Number)
], StorePromoSelected.prototype, "month", void 0);
__decorate([
    typeorm_1.Column("json", { name: "print_config", nullable: true }),
    __metadata("design:type", Object)
], StorePromoSelected.prototype, "printConfig", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], StorePromoSelected.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], StorePromoSelected.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promo_1.Promo, promo => promo.storePromoSelecteds, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "promo_id", referencedColumnName: "id" }]),
    __metadata("design:type", Promo_1.Promo)
], StorePromoSelected.prototype, "promo", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Store_1.Store, store => store.storePromoSelecteds, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "store_id", referencedColumnName: "id" }]),
    __metadata("design:type", Store_1.Store)
], StorePromoSelected.prototype, "store", void 0);
StorePromoSelected = __decorate([
    typeorm_1.Index("store_promo_selected_store_id_fk", ["storeId"], {}),
    typeorm_1.Index("store_promo_selected_promo_id_fk", ["promoId"], {}),
    typeorm_1.Entity("store_promo_selected", { schema: "hg_promo_beta" })
], StorePromoSelected);
exports.StorePromoSelected = StorePromoSelected;
//# sourceMappingURL=StorePromoSelected.js.map