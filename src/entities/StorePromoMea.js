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
const RejectionReason_1 = require("./RejectionReason");
const Store_1 = require("./Store");
const Promo_1 = require("./Promo");
let StorePromoMea = class StorePromoMea {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'store_id' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'promo_id' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "promoId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'rejected_reason_id' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "rejectedReasonId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'month' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "month", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'year' }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "year", void 0);
__decorate([
    typeorm_1.Column('tinyint', { name: 'active', nullable: true, width: 1 }),
    __metadata("design:type", Boolean)
], StorePromoMea.prototype, "active", void 0);
__decorate([
    typeorm_1.Column('enum', {
        name: 'state',
        enum: [
            'TO_JUSTIFY',
            'PENDING',
            'CONFIRMED',
            'REJECTED',
            'NOT_JUSTIFIED',
            'OPERATION_REFUSED',
        ],
        default: () => "'TO_JUSTIFY'",
    }),
    __metadata("design:type", String)
], StorePromoMea.prototype, "state", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'rejection_number', default: () => "'2'" }),
    __metadata("design:type", Number)
], StorePromoMea.prototype, "rejectionNumber", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'url_picture', nullable: true, length: 256 }),
    __metadata("design:type", String)
], StorePromoMea.prototype, "urlPicture", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'url_sells_listing', nullable: true, length: 256 }),
    __metadata("design:type", String)
], StorePromoMea.prototype, "urlSellsListing", void 0);
__decorate([
    typeorm_1.Column('datetime', { name: 'uploaded_at', nullable: true }),
    __metadata("design:type", Date)
], StorePromoMea.prototype, "uploadedAt", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], StorePromoMea.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], StorePromoMea.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RejectionReason_1.RejectionReason, rejectionReason => rejectionReason.storePromoMeas, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'rejected_reason_id', referencedColumnName: 'id' }]),
    __metadata("design:type", RejectionReason_1.RejectionReason)
], StorePromoMea.prototype, "rejectedReason", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Store_1.Store, store => store.storePromoMeas, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Store_1.Store)
], StorePromoMea.prototype, "store", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Promo_1.Promo, promo => promo.storePromoMeas, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'promo_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Promo_1.Promo)
], StorePromoMea.prototype, "promo", void 0);
StorePromoMea = __decorate([
    typeorm_1.Index('store_promo_mea_store_id_fk', ['storeId'], {}),
    typeorm_1.Index('store_promo_mea_promo_id_fk', ['promoId'], {}),
    typeorm_1.Index('store_promo_mea_rejected_reason_id_fk', ['rejectedReasonId'], {}),
    typeorm_1.Entity('store_promo_mea', { schema: 'hg_promo_beta' })
], StorePromoMea);
exports.StorePromoMea = StorePromoMea;
//# sourceMappingURL=StorePromoMea.js.map