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
const Laboratory_1 = require("./Laboratory");
const Gamme_1 = require("./Gamme");
let Brand = class Brand {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Brand.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('int', { name: 'laboratory_id' }),
    __metadata("design:type", Number)
], Brand.prototype, "laboratoryId", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'name', length: 256 }),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Laboratory_1.Laboratory, laboratory => laboratory.brands, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }),
    typeorm_1.JoinColumn([{ name: 'laboratory_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Laboratory_1.Laboratory)
], Brand.prototype, "laboratory", void 0);
__decorate([
    typeorm_1.OneToMany(() => Gamme_1.Gamme, gamme => gamme.brand),
    __metadata("design:type", Array)
], Brand.prototype, "gammes", void 0);
Brand = __decorate([
    typeorm_1.Index('brand_laboratory_id_fk', ['laboratoryId'], {}),
    typeorm_1.Entity('brand', { schema: 'hg_promo_beta' })
], Brand);
exports.Brand = Brand;
//# sourceMappingURL=Brand.js.map