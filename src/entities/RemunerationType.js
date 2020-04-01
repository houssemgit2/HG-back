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
const Remuneration_1 = require("./Remuneration");
let RemunerationType = class RemunerationType {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "id" }),
    __metadata("design:type", Number)
], RemunerationType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "name", length: 256 }),
    __metadata("design:type", String)
], RemunerationType.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => Remuneration_1.Remuneration, remuneration => remuneration.remunerationType),
    __metadata("design:type", Array)
], RemunerationType.prototype, "remunerations", void 0);
RemunerationType = __decorate([
    typeorm_1.Entity("remuneration_type", { schema: "hg_promo_beta" })
], RemunerationType);
exports.RemunerationType = RemunerationType;
//# sourceMappingURL=RemunerationType.js.map