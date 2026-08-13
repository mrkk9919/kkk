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
exports.LedgerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../entities/ledger-entry.entity");
const enums_1 = require("../common/enums");
const users_service_1 = require("../users/users.service");
let LedgerService = class LedgerService {
    ledgerRepository;
    usersService;
    dataSource;
    constructor(ledgerRepository, usersService, dataSource) {
        this.ledgerRepository = ledgerRepository;
        this.usersService = usersService;
        this.dataSource = dataSource;
    }
    async post(input) {
        return this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(ledger_entry_entity_1.LedgerEntry);
            const existing = await repo.findOne({
                where: {
                    transactionId: input.transactionId,
                    accountType: input.accountType,
                    entryType: input.entryType,
                },
            });
            if (existing) {
                return existing;
            }
            const key = input.accountType === enums_1.AccountType.USER
                ? input.userId
                : 'MASTER';
            const lastEntry = await repo
                .createQueryBuilder('ledger')
                .where('ledger.account_type = :accountType', {
                accountType: input.accountType,
            })
                .orderBy('ledger.created_at', 'DESC')
                .getOne();
            const balanceBefore = lastEntry ? Number(lastEntry.balanceAfter) : 0;
            const amount = Number(input.amount);
            const balanceAfter = balanceBefore + amount;
            const entry = repo.create({
                transactionId: input.transactionId,
                accountType: input.accountType,
                userId: input.userId,
                entryType: input.entryType,
                amount: amount.toFixed(2),
                balanceBefore: balanceBefore.toFixed(2),
                balanceAfter: balanceAfter.toFixed(2),
                status: input.entryType === enums_1.EntryType.SETTLEMENT_OUT
                    ? enums_1.LedgerStatus.SETTLED
                    : enums_1.LedgerStatus.PENDING_SETTLEMENT,
            });
            return repo.save(entry);
        });
    }
    async getEntriesForUser(userId) {
        return this.ledgerRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getMasterEntries() {
        return this.ledgerRepository.find({
            where: { accountType: enums_1.AccountType.MASTER },
            order: { createdAt: 'DESC' },
        });
    }
    async getEntriesForOrder(transactionId) {
        return this.ledgerRepository.find({
            where: { transactionId },
            order: { createdAt: 'ASC' },
        });
    }
    async getBalance(userId) {
        const user = await this.usersService.findById(userId);
        const entries = await this.ledgerRepository.find({
            where: { userId: user.id },
            order: { createdAt: 'ASC' },
        });
        return entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
    }
    async getUserReceivable(userId) {
        const entries = await this.ledgerRepository.find({
            where: {
                userId,
                accountType: enums_1.AccountType.USER,
                entryType: enums_1.EntryType.RECEIVABLE,
                status: enums_1.LedgerStatus.PENDING_SETTLEMENT,
            },
        });
        return entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
    }
};
exports.LedgerService = LedgerService;
exports.LedgerService = LedgerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        typeorm_2.DataSource])
], LedgerService);
//# sourceMappingURL=ledger.service.js.map