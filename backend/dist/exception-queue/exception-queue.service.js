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
exports.ExceptionQueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exception_queue_entity_1 = require("../entities/exception-queue.entity");
const enums_1 = require("../common/enums");
let ExceptionQueueService = class ExceptionQueueService {
    exceptionRepository;
    constructor(exceptionRepository) {
        this.exceptionRepository = exceptionRepository;
    }
    async add(input) {
        const entry = this.exceptionRepository.create({
            category: input.category,
            orderId: input.orderId,
            transactionId: input.transactionId,
            detail: input.detail,
            status: enums_1.ExceptionStatus.OPEN,
        });
        return this.exceptionRepository.save(entry);
    }
    async findAll(status) {
        const where = status ? { status } : {};
        return this.exceptionRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async resolve(id) {
        const entry = await this.exceptionRepository.findOne({ where: { id } });
        if (!entry) {
            throw new Error('Exception entry not found');
        }
        entry.status = enums_1.ExceptionStatus.RESOLVED;
        entry.resolvedAt = new Date();
        return this.exceptionRepository.save(entry);
    }
};
exports.ExceptionQueueService = ExceptionQueueService;
exports.ExceptionQueueService = ExceptionQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exception_queue_entity_1.ExceptionQueue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExceptionQueueService);
//# sourceMappingURL=exception-queue.service.js.map