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
exports.MasterAccountController = void 0;
const common_1 = require("@nestjs/common");
const master_account_service_1 = require("./master-account.service");
const create_master_account_dto_1 = require("./dto/create-master-account.dto");
let MasterAccountController = class MasterAccountController {
    masterService;
    constructor(masterService) {
        this.masterService = masterService;
    }
    async create(dto) {
        const master = await this.masterService.create(dto);
        return { master };
    }
    async getActive() {
        const master = await this.masterService.findActiveMaster();
        return { master };
    }
};
exports.MasterAccountController = MasterAccountController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_master_account_dto_1.CreateMasterAccountDto]),
    __metadata("design:returntype", Promise)
], MasterAccountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterAccountController.prototype, "getActive", null);
exports.MasterAccountController = MasterAccountController = __decorate([
    (0, common_1.Controller)('master-account'),
    __metadata("design:paramtypes", [master_account_service_1.MasterAccountService])
], MasterAccountController);
//# sourceMappingURL=master-account.controller.js.map