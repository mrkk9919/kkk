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
exports.ProviderRegistry = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const provider_interface_1 = require("./provider.interface");
const mock_provider_1 = require("./mock.provider");
let ProviderRegistry = class ProviderRegistry {
    configService;
    paymentProviders = new Map();
    settlementProviders = new Map();
    constructor(configService, mockPayment, mockSettlement) {
        this.configService = configService;
        this.registerPayment(mockPayment);
        this.registerSettlement(mockSettlement);
    }
    registerPayment(provider) {
        this.paymentProviders.set(provider.name, provider);
    }
    registerSettlement(provider) {
        this.settlementProviders.set(provider.name, provider);
    }
    getPaymentProvider() {
        const name = this.configService.get(provider_interface_1.PAYMENT_PROVIDER, 'mock') ?? 'mock';
        const provider = this.paymentProviders.get(name);
        if (!provider) {
            throw new common_1.NotFoundException(`Payment provider "${name}" is not registered`);
        }
        return provider;
    }
    getSettlementProvider() {
        const name = this.configService.get(provider_interface_1.SETTLEMENT_PROVIDER, 'mock') ?? 'mock';
        const provider = this.settlementProviders.get(name);
        if (!provider) {
            throw new common_1.NotFoundException(`Settlement provider "${name}" is not registered`);
        }
        return provider;
    }
    async pay(request) {
        return this.getPaymentProvider().pay(request);
    }
    async settle(request) {
        return this.getSettlementProvider().settle(request);
    }
};
exports.ProviderRegistry = ProviderRegistry;
exports.ProviderRegistry = ProviderRegistry = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mock_provider_1.MockPaymentProvider,
        mock_provider_1.MockSettlementProvider])
], ProviderRegistry);
//# sourceMappingURL=provider-registry.js.map