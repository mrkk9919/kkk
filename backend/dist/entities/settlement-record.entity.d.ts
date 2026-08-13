import { SettlementRecordStatus } from '../common/enums';
import { PaymentOrder } from './payment-order.entity';
import { User } from './user.entity';
export declare class SettlementRecord {
    id: string;
    orderId: string;
    order: PaymentOrder;
    userId: string;
    user: User;
    amount: string;
    destination: string;
    status: SettlementRecordStatus;
    providerTransactionId: string | null;
    createdAt: Date;
    completedAt: Date;
}
