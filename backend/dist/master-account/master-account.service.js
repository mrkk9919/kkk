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
exports.MasterAccountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const master_account_entity_1 = require("../entities/master-account.entity");
const enums_1 = require("../common/enums");
const bakong_qr_generator_1 = require("../qr/bakong-qr.generator");
let MasterAccountService = class MasterAccountService {
    masterRepository;
    constructor(masterRepository) {
        this.masterRepository = masterRepository;
    }
    async create(dto) {
        const existing = await this.masterRepository.findOne({
            where: { accountIdentifier: dto.accountIdentifier },
        });
        if (existing) {
            throw new common_1.ConflictException('Master Account already exists');
        }
        const qrPayload = dto.qrPayload ||
            bakong_qr_generator_1.BakongQrGenerator.generate({
                payloadFormatIndicator: '01',
                pointOfInitiation: '11',
                bakongAccountId: dto.accountIdentifier,
                merchantName: dto.accountIdentifier,
            });
        const master = this.masterRepository.create({
            accountIdentifier: dto.accountIdentifier,
            phone: dto.phone,
            qrPayload,
            status: enums_1.UserStatus.ACTIVE,
        });
        return this.masterRepository.save(master);
    }
    async findActiveMaster() {
        return this.masterRepository.findOne({
            where: { status: enums_1.UserStatus.ACTIVE },
            order: { createdAt: 'ASC' },
        });
    }
    async findById(id) {
        const master = await this.masterRepository.findOne({ where: { id } });
        if (!master) {
            throw new common_1.NotFoundException('Master Account not found');
        }
        return master;
    }
};
exports.MasterAccountService = MasterAccountService;
exports.MasterAccountService = MasterAccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(master_account_entity_1.MasterAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MasterAccountService);
//# sourceMappingURL=master-account.service.js.map