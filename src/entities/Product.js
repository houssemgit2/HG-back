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
const Gamme_1 = require("./Gamme");
let Product = class Product {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "ean" }),
    __metadata("design:type", Number)
], Product.prototype, "ean", void 0);
__decorate([
    typeorm_1.Column("int", { name: "gamme_id" }),
    __metadata("design:type", Number)
], Product.prototype, "gammeId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 64 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Gamme_1.Gamme, gamme => gamme.products, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "gamme_id", referencedColumnName: "id" }]),
    __metadata("design:type", Gamme_1.Gamme)
], Product.prototype, "gamme", void 0);
Product = __decorate([
    typeorm_1.Index("product_gamme_id_fk", ["gammeId"], {}),
    typeorm_1.Entity("product", { schema: "hg_promo_beta" })
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map