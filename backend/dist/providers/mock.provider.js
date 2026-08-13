"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSettlementProvider = exports.MockPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let MockPaymentProvider = class MockPaymentProvider {
    name = 'mock';
    async pay(request) {
        return {
            success: true,
            transactionId: `MOCK_TX_${(0, crypto_1.randomUUID)().replace(/-/g, '')}`,
            message: 'Mock payment accepted',
        };
    }
};
exports.MockPaymentProvider = MockPaymentProvider;
exports.MockPaymentProvider = MockPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], MockPaymentProvider);
let MockSettlementProvider = class MockSettlementProvider {
    name = 'mock';
    async settle(request) {
        return {
            success: true,
            providerTransactionId: `MOCK_STL_${(0, crypto_1.randomUUID)().replace(/-/g, '')}`,
            message: 'Mock settlement completed',
        };
    }
};
exports.MockSettlementProvider = MockSettlementProvider;
exports.MockSettlementProvider = MockSettlementProvider = __decorate([
    (0, common_1.Injectable)()
], MockSettlementProvider);
//# sourceMappingURL=mock.provider.js.map