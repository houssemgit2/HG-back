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
const RefreshToken_1 = require("./RefreshToken");
const Store_1 = require("./Store");
const UserRole_1 = require("./UserRole");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'store_id' }),
    __metadata("design:type", Number)
], User.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'user_role_id' }),
    __metadata("design:type", Number)
], User.prototype, "userRoleId", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'first_name', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'last_name', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'password', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'email', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'phone', nullable: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'address', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_at',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'updated_at',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => RefreshToken_1.RefreshToken, refreshToken => refreshToken.user),
    __metadata("design:type", Array)
], User.prototype, "refreshTokens", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Store_1.Store, store => store.users, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'store_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Store_1.Store)
], User.prototype, "store", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserRole_1.UserRole, userRole => userRole.users, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'user_role_id', referencedColumnName: 'id' }]),
    __metadata("design:type", UserRole_1.UserRole)
], User.prototype, "userRole", void 0);
User = __decorate([
    typeorm_1.Index('user_store_id_fk', ['storeId'], {}),
    typeorm_1.Index('user_user_role_id_fk', ['userRoleId'], {}),
    typeorm_1.Entity('user', { schema: 'hg_promo_beta' })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map