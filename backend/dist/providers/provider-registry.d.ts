import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentRequest, PaymentResult, SettlementProvider, SettlementRequest, SettlementResult } from './provider.interface';
import { MockPaymentProvider, MockSettlementProvider } from './mock.provider';
export declare class ProviderRegistry {
    private readonly configService;
    private paymentProviders;
    private settlementProviders;
    constructor(configService: ConfigService, mockPayment: MockPaymentProvider, mockSettlement: MockSettlementProvider);
    registerPayment(provider: PaymentProvider): void;
    registerSettlement(provider: SettlementProvider): void;
    getPaymentProvider(): PaymentProvider;
    getSettlementProvider(): SettlementProvider;
    pay(request: PaymentRequest): Promise<PaymentResult>;
    settle(request: SettlementRequest): Promise<SettlementResult>;
}
