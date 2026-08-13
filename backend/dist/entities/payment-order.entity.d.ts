import { OrderStatus } from '../common/enums';
import { MasterAccount } from './master-account.entity';
import { QrCode } from './qr-code.entity';
import { User } from './user.entity';
export declare class PaymentOrder {
    id: string;
    orderNo: string;
    payerUserId: string;
    payer: User;
    receiverUserId: string;
    receiver: User;
    qrId: string;
    qr: QrCode;
    amount: string;
    currency: string;
    masterAccountId: string;
    masterAccount: MasterAccount;
    transactionId: string;
    paymentStatus: OrderStatus;
    settlementStatus: string;
    createdAt: Date;
    paidAt: Date;
    settledAt: Date;
}
