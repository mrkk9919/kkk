"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterAccountModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const master_account_entity_1 = require("../entities/master-account.entity");
const master_account_service_1 = require("./master-account.service");
const master_account_controller_1 = require("./master-account.controller");
let MasterAccountModule = class MasterAccountModule {
};
exports.MasterAccountModule = MasterAccountModule;
exports.MasterAccountModule = MasterAccountModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([master_account_entity_1.MasterAccount])],
        controllers: [master_account_controller_1.MasterAccountController],
        providers: [master_account_service_1.MasterAccountService],
        exports: [master_account_service_1.MasterAccountService],
    })
], MasterAccountModule);
//# sourceMappingURL=master-account.module.js.map