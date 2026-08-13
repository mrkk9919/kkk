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
exports.Callback = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
let Callback = class Callback {
    id;
    transactionId;
    callbackType;
    payload;
    signature;
    status;
    receivedAt;
    processedAt;
};
exports.Callback = Callback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Callback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_id', unique: true }),
    __metadata("design:type", String)
], Callback.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'callback_type', type: 'varchar' }),
    __metadata("design:type", String)
], Callback.prototype, "callbackType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payload', type: 'jsonb' }),
    __metadata("design:type", Object)
], Callback.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'signature', type: 'text' }),
    __metadata("design:type", String)
], Callback.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar' }),
    __metadata("design:type", String)
], Callback.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Callback.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Callback.prototype, "processedAt", void 0);
exports.Callback = Callback = __decorate([
    (0, typeorm_1.Entity)('callbacks')
], Callback);
//# sourceMappingURL=callback.entity.js.map