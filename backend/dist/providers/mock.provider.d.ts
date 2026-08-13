import { PaymentProvider, PaymentRequest, PaymentResult, SettlementProvider, SettlementRequest, SettlementResult } from './provider.interface';
export declare class MockPaymentProvider implements PaymentProvider {
    readonly name = "mock";
    pay(request: PaymentRequest): Promise<PaymentResult>;
}
export declare class MockSettlementProvider implements SettlementProvider {
    readonly name = "mock";
    settle(request: SettlementRequest): Promise<SettlementResult>;
}
