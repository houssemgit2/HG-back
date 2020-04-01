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
const Cluster_1 = require("./Cluster");
const StorePermission_1 = require("./StorePermission");
const StorePromoMea_1 = require("./StorePromoMea");
const StorePromoSelected_1 = require("./StorePromoSelected");
const User_1 = require("./User");
let Store = class Store {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], Store.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "cluster_id" }),
    __metadata("design:type", Number)
], Store.prototype, "clusterId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "cip", length: 32 }),
    __metadata("design:type", String)
], Store.prototype, "cip", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 132 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Store.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], Store.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Cluster_1.Cluster, cluster => cluster.stores, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "cluster_id", referencedColumnName: "id" }]),
    __metadata("design:type", Cluster_1.Cluster)
], Store.prototype, "cluster", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePermission_1.StorePermission, storePermission => storePermission.store),
    __metadata("design:type", Array)
], Store.prototype, "storePermissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePromoMea_1.StorePromoMea, storePromoMea => storePromoMea.store),
    __metadata("design:type", Array)
], Store.prototype, "storePromoMeas", void 0);
__decorate([
    typeorm_1.OneToMany(() => StorePromoSelected_1.StorePromoSelected, storePromoSelected => storePromoSelected.store),
    __metadata("design:type", Array)
], Store.prototype, "storePromoSelecteds", void 0);
__decorate([
    typeorm_1.OneToMany(() => User_1.User, user => user.store),
    __metadata("design:type", Array)
], Store.prototype, "users", void 0);
Store = __decorate([
    typeorm_1.Index("store_cluster_id_fk", ["clusterId"], {}),
    typeorm_1.Entity("store", { schema: "hg_promo_beta" })
], Store);
exports.Store = Store;
//# sourceMappingURL=Store.js.map