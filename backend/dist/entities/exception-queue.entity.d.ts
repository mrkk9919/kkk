import { ExceptionCategory, ExceptionStatus } from '../common/enums';
export declare class ExceptionQueue {
    id: string;
    category: ExceptionCategory;
    orderId: string;
    transactionId: string;
    detail: Record<string, unknown>;
    status: ExceptionStatus;
    createdAt: Date;
    resolvedAt: Date;
}
