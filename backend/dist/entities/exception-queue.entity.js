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
exports.ExceptionQueue = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
let ExceptionQueue = class ExceptionQueue {
    id;
    category;
    orderId;
    transactionId;
    detail;
    status;
    createdAt;
    resolvedAt;
};
exports.ExceptionQueue = ExceptionQueue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExceptionQueue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category', type: 'varchar' }),
    __metadata("design:type", String)
], ExceptionQueue.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ExceptionQueue.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ExceptionQueue.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detail', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ExceptionQueue.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', default: enums_1.ExceptionStatus.OPEN }),
    __metadata("design:type", String)
], ExceptionQueue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExceptionQueue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], ExceptionQueue.prototype, "resolvedAt", void 0);
exports.ExceptionQueue = ExceptionQueue = __decorate([
    (0, typeorm_1.Entity)('exception_queue')
], ExceptionQueue);
//# sourceMappingURL=exception-queue.entity.js.map