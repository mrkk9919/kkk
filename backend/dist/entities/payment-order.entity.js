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
exports.PaymentOrder = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
const master_account_entity_1 = require("./master-account.entity");
const qr_code_entity_1 = require("./qr-code.entity");
const user_entity_1 = require("./user.entity");
let PaymentOrder = class PaymentOrder {
    id;
    orderNo;
    payerUserId;
    payer;
    receiverUserId;
    receiver;
    qrId;
    qr;
    amount;
    currency;
    masterAccountId;
    masterAccount;
    transactionId;
    paymentStatus;
    settlementStatus;
    createdAt;
    paidAt;
    settledAt;
};
exports.PaymentOrder = PaymentOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_no', unique: true }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "orderNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payer_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "payerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'payer_user_id' }),
    __metadata("design:type", user_entity_1.User)
], PaymentOrder.prototype, "payer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "receiverUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'receiver_user_id' }),
    __metadata("design:type", user_entity_1.User)
], PaymentOrder.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_id', type: 'uuid' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "qrId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => qr_code_entity_1.QrCode),
    (0, typeorm_1.JoinColumn)({ name: 'qr_id' }),
    __metadata("design:type", qr_code_entity_1.QrCode)
], PaymentOrder.prototype, "qr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3 }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'master_account_id', type: 'uuid' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "masterAccountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => master_account_entity_1.MasterAccount),
    (0, typeorm_1.JoinColumn)({ name: 'master_account_id' }),
    __metadata("design:type", master_account_entity_1.MasterAccount)
], PaymentOrder.prototype, "masterAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', nullable: true, unique: true }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'varchar' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'settlement_status', type: 'varchar', default: 'NONE' }),
    __metadata("design:type", String)
], PaymentOrder.prototype, "settlementStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrder.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'settled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], PaymentOrder.prototype, "settledAt", void 0);
exports.PaymentOrder = PaymentOrder = __decorate([
    (0, typeorm_1.Entity)('payment_orders')
], PaymentOrder);
//# sourceMappingURL=payment-order.entity.js.map