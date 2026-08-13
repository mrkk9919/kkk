export interface PaymentRequest {
    orderNo: string;
    payerAccount: string;
    receiverAccount: string;
    amount: string;
    currency: string;
    qrPayload: string;
}
export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    message?: string;
}
export interface SettlementRequest {
    amount: string;
    currency: string;
    destination: string;
    orderNo: string;
}
export interface SettlementResult {
    success: boolean;
    providerTransactionId?: string;
    message?: string;
}
export interface PaymentProvider {
    readonly name: string;
    pay(request: PaymentRequest): Promise<PaymentResult>;
}
export interface SettlementProvider {
    readonly name: string;
    settle(request: SettlementRequest): Promise<SettlementResult>;
}
export declare const PAYMENT_PROVIDER = "PAYMENT_PROVIDER";
export declare const SETTLEMENT_PROVIDER = "SETTLEMENT_PROVIDER";
