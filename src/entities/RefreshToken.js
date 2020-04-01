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
const User_1 = require("./User");
let RefreshToken = class RefreshToken {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], RefreshToken.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "user_id" }),
    __metadata("design:type", Number)
], RefreshToken.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "token", length: 255 }),
    __metadata("design:type", String)
], RefreshToken.prototype, "token", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "user_email", length: 255 }),
    __metadata("design:type", String)
], RefreshToken.prototype, "userEmail", void 0);
__decorate([
    typeorm_1.Column("datetime", { name: "expires" }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "expires", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "created_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column("datetime", {
        name: "updated_at",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP"
    }),
    __metadata("design:type", Date)
], RefreshToken.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.refreshTokens, { onDelete: "RESTRICT", onUpdate: "RESTRICT" }),
    typeorm_1.JoinColumn([{ name: "user_id", referencedColumnName: "id" }]),
    __metadata("design:type", User_1.User)
], RefreshToken.prototype, "user", void 0);
RefreshToken = __decorate([
    typeorm_1.Index("refresh_token_user_id_fk", ["userId"], {}),
    typeorm_1.Entity("refresh_token", { schema: "hg_promo_beta" })
], RefreshToken);
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map