"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const users_module_1 = require("../users/users.module");
const qr_module_1 = require("../qr/qr.module");
const master_account_module_1 = require("../master-account/master-account.module");
const exception_queue_module_1 = require("../exception-queue/exception-queue.module");
const order_state_machine_1 = require("./order-state-machine");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_order_entity_1.PaymentOrder]),
            users_module_1.UsersModule,
            qr_module_1.QrModule,
            master_account_module_1.MasterAccountModule,
            exception_queue_module_1.ExceptionQueueModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, order_state_machine_1.OrderStateMachine],
        exports: [payments_service_1.PaymentsService, order_state_machine_1.OrderStateMachine],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map