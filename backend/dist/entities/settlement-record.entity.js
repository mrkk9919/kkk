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
exports.SettlementRecord = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
const payment_order_entity_1 = require("./payment-order.entity");
const user_entity_1 = require("./user.entity");
let SettlementRecord = class SettlementRecord {
    id;
    orderId;
    order;
    userId;
    user;
    amount;
    destination;
    status;
    providerTransactionId;
    createdAt;
    completedAt;
};
exports.SettlementRecord = SettlementRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SettlementRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'uuid', unique: true }),
    __metadata("design:type", String)
], SettlementRecord.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_order_entity_1.PaymentOrder),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", payment_order_entity_1.PaymentOrder)
], SettlementRecord.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], SettlementRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SettlementRecord.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], SettlementRecord.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'destination', type: 'varchar' }),
    __metadata("design:type", String)
], SettlementRecord.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar' }),
    __metadata("design:type", String)
], SettlementRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_transaction_id', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], SettlementRecord.prototype, "providerTransactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SettlementRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SettlementRecord.prototype, "completedAt", void 0);
exports.SettlementRecord = SettlementRecord = __decorate([
    (0, typeorm_1.Entity)('settlement_records')
], SettlementRecord);
//# sourceMappingURL=settlement-record.entity.js.map