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
exports.QrCode = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
const user_entity_1 = require("./user.entity");
let QrCode = class QrCode {
    id;
    userId;
    user;
    qrType;
    qrPayload;
    qrImage;
    status;
    createdAt;
    updatedAt;
};
exports.QrCode = QrCode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QrCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], QrCode.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], QrCode.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_type', type: 'varchar' }),
    __metadata("design:type", String)
], QrCode.prototype, "qrType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_payload', type: 'text' }),
    __metadata("design:type", String)
], QrCode.prototype, "qrPayload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_image', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QrCode.prototype, "qrImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', default: enums_1.QrStatus.ACTIVE }),
    __metadata("design:type", String)
], QrCode.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QrCode.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QrCode.prototype, "updatedAt", void 0);
exports.QrCode = QrCode = __decorate([
    (0, typeorm_1.Entity)('qr_codes')
], QrCode);
//# sourceMappingURL=qr-code.entity.js.map