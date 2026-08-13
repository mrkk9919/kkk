"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const qr_code_entity_1 = require("../entities/qr-code.entity");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const exception_queue_entity_1 = require("../entities/exception-queue.entity");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const admin_controller_1 = require("./admin.controller");
const ledger_module_1 = require("../ledger/ledger.module");
const auth_module_1 = require("../auth/auth.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, qr_code_entity_1.QrCode, payment_order_entity_1.PaymentOrder, exception_queue_entity_1.ExceptionQueue]),
            ledger_module_1.LedgerModule,
            auth_module_1.AuthModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_dashboard_service_1.AdminDashboardService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map