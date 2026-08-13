"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const settlement_record_entity_1 = require("../entities/settlement-record.entity");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const ledger_entry_entity_1 = require("../entities/ledger-entry.entity");
const settlement_service_1 = require("./settlement.service");
const settlement_controller_1 = require("./settlement.controller");
const payments_module_1 = require("../payments/payments.module");
const exception_queue_module_1 = require("../exception-queue/exception-queue.module");
const users_module_1 = require("../users/users.module");
const ledger_module_1 = require("../ledger/ledger.module");
let SettlementModule = class SettlementModule {
};
exports.SettlementModule = SettlementModule;
exports.SettlementModule = SettlementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                settlement_record_entity_1.SettlementRecord,
                payment_order_entity_1.PaymentOrder,
                ledger_entry_entity_1.LedgerEntry,
            ]),
            payments_module_1.PaymentsModule,
            exception_queue_module_1.ExceptionQueueModule,
            users_module_1.UsersModule,
            ledger_module_1.LedgerModule,
        ],
        controllers: [settlement_controller_1.SettlementController],
        providers: [settlement_service_1.SettlementService],
        exports: [settlement_service_1.SettlementService],
    })
], SettlementModule);
//# sourceMappingURL=settlement.module.js.map