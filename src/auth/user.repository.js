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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const typeorm_2 = require("@nestjs/typeorm");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }
    async register(authCredentialDto) {
        const { storeId, firstName, lastName, password, email, userRoleId, address, } = authCredentialDto;
        const user = new User_1.User();
        user.storeId = storeId;
        user.userRoleId = userRoleId;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        user.email = email;
        user.address = address;
        const found = await user.save();
        return found;
    }
    async login(authCredentialDto) { }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(User_1.User),
    __param(0, typeorm_2.InjectRepository(User_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map