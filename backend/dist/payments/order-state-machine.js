"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStateMachine = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
const TRANSITIONS = {
    [enums_1.OrderStatus.CREATED]: [enums_1.OrderStatus.PAYMENT_PENDING, enums_1.OrderStatus.REVERSED],
    [enums_1.OrderStatus.PAYMENT_PENDING]: [
        enums_1.OrderStatus.PAYMENT_SUCCESS,
        enums_1.OrderStatus.PAYMENT_FAILED,
    ],
    [enums_1.OrderStatus.PAYMENT_SUCCESS]: [
        enums_1.OrderStatus.MASTER_RECEIVED,
        enums_1.OrderStatus.REFUNDED,
    ],
    [enums_1.OrderStatus.PAYMENT_FAILED]: [enums_1.OrderStatus.PAYMENT_PENDING, enums_1.OrderStatus.REFUNDED],
    [enums_1.OrderStatus.MASTER_RECEIVED]: [enums_1.OrderStatus.SETTLEMENT_PENDING],
    [enums_1.OrderStatus.SETTLEMENT_PENDING]: [enums_1.OrderStatus.SETTLEMENT_PROCESSING],
    [enums_1.OrderStatus.SETTLEMENT_PROCESSING]: [
        enums_1.OrderStatus.SETTLEMENT_SUCCESS,
        enums_1.OrderStatus.SETTLEMENT_FAILED,
    ],
    [enums_1.OrderStatus.SETTLEMENT_FAILED]: [enums_1.OrderStatus.SETTLEMENT_PROCESSING],
    [enums_1.OrderStatus.SETTLEMENT_SUCCESS]: [enums_1.OrderStatus.REFUNDED, enums_1.OrderStatus.REVERSED],
    [enums_1.OrderStatus.REFUNDED]: [],
    [enums_1.OrderStatus.REVERSED]: [],
};
let OrderStateMachine = class OrderStateMachine {
    canTransition(from, to) {
        const allowed = TRANSITIONS[from] ?? [];
        return allowed.includes(to);
    }
    transition(from, to) {
        if (!this.canTransition(from, to)) {
            throw new common_1.BadRequestException(`Invalid order status transition: ${from} -> ${to}`);
        }
        return to;
    }
};
exports.OrderStateMachine = OrderStateMachine;
exports.OrderStateMachine = OrderStateMachine = __decorate([
    (0, common_1.Injectable)()
], OrderStateMachine);
//# sourceMappingURL=order-state-machine.js.map