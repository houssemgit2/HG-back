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
const Store_1 = require("./Store");
let StorePermission = class StorePermission {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], StorePermission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "store_id" }),
    __metadata("design:type", Number)
], StorePermission.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "resource", length: 64 }),
    __metadata("design:type", String)
], StorePermission.prototype, "resource", void 0);
__decorate([
    typeorm_1.Column("tinyint", { name: "allow", nullable: true, width: 1 }),
    __metadata("design:type", Boolean)
], StorePermission.prototype, "allow", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], StorePermission.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], StorePermission.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Store_1.Store, store => store.storePermissions, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "store_id", referencedColumnName: "id" }]),
    __metadata("design:type", Store_1.Store)
], StorePermission.prototype, "store", void 0);
StorePermission = __decorate([
    typeorm_1.Index("store_permission_store_id_fk", ["storeId"], {}),
    typeorm_1.Entity("store_permission", { schema: "hg_promo_beta" })
], StorePermission);
exports.StorePermission = StorePermission;
//# sourceMappingURL=StorePermission.js.map