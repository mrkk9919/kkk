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
exports.LedgerEntry = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
let LedgerEntry = class LedgerEntry {
    id;
    transactionId;
    userId;
    accountType;
    entryType;
    amount;
    balanceBefore;
    balanceAfter;
    status;
    createdAt;
};
exports.LedgerEntry = LedgerEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LedgerEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], LedgerEntry.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_type', type: 'varchar' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "accountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entry_type', type: 'varchar' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "entryType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_before', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "balanceBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_after', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', default: enums_1.LedgerStatus.PENDING_SETTLEMENT }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LedgerEntry.prototype, "createdAt", void 0);
exports.LedgerEntry = LedgerEntry = __decorate([
    (0, typeorm_1.Entity)('ledger_entries'),
    (0, typeorm_1.Index)(['transactionId', 'accountType', 'entryType'], { unique: true })
], LedgerEntry);
//# sourceMappingURL=ledger-entry.entity.js.map