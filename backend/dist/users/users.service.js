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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const enums_1 = require("../common/enums");
const qr_service_1 = require("../qr/qr.service");
let UsersService = class UsersService {
    usersRepository;
    qrService;
    constructor(usersRepository, qrService) {
        this.usersRepository = usersRepository;
        this.qrService = qrService;
    }
    async create(dto) {
        const existing = await this.usersRepository.findOne({
            where: { wingAccount: dto.wingAccount },
        });
        if (existing) {
            throw new common_1.ConflictException('Wing Account already exists');
        }
        const user = this.usersRepository.create({
            wingAccount: dto.wingAccount,
            realName: dto.realName,
            phone: dto.phone,
            status: enums_1.UserStatus.ACTIVE,
        });
        const saved = await this.usersRepository.save(user);
        await this.qrService.generatePersonalQr(saved.id, saved.wingAccount, saved.realName);
        return saved;
    }
    async findAll() {
        return this.usersRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByWingAccount(wingAccount) {
        return this.usersRepository.findOne({ where: { wingAccount } });
    }
    async getUserQr(id) {
        const user = await this.findById(id);
        return this.qrService.getActivePersonalQr(user.id);
    }
    async setStatus(id, status) {
        const user = await this.findById(id);
        user.status = status;
        return this.usersRepository.save(user);
    }
    async regenerateQr(id) {
        const user = await this.findById(id);
        const qr = await this.qrService.generatePersonalQr(user.id, user.wingAccount, user.realName);
        return { qr };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        qr_service_1.QrService])
], UsersService);
//# sourceMappingURL=users.service.js.map