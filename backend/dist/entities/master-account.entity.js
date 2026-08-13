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
exports.MasterAccount = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
let MasterAccount = class MasterAccount {
    id;
    accountIdentifier;
    phone;
    qrPayload;
    status;
    createdAt;
    updatedAt;
};
exports.MasterAccount = MasterAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MasterAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_identifier' }),
    __metadata("design:type", String)
], MasterAccount.prototype, "accountIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 32, nullable: true }),
    __metadata("design:type", String)
], MasterAccount.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_payload', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MasterAccount.prototype, "qrPayload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', default: enums_1.UserStatus.ACTIVE }),
    __metadata("design:type", String)
], MasterAccount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MasterAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MasterAccount.prototype, "updatedAt", void 0);
exports.MasterAccount = MasterAccount = __decorate([
    (0, typeorm_1.Entity)('master_accounts')
], MasterAccount);
//# sourceMappingURL=master-account.entity.js.map