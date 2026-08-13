import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { QrCode } from '../entities/qr-code.entity';
import { PaymentOrder } from '../entities/payment-order.entity';
import { ExceptionQueue } from '../entities/exception-queue.entity';
import { OrderStatus } from '../common/enums';
import { LedgerService } from '../ledger/ledger.service';
export declare class AdminDashboardService {
    private readonly userRepository;
    private readonly qrRepository;
    private readonly orderRepository;
    private readonly exceptionRepository;
    private readonly ledgerService;
    constructor(userRepository: Repository<User>, qrRepository: Repository<QrCode>, orderRepository: Repository<PaymentOrder>, exceptionRepository: Repository<ExceptionQueue>, ledgerService: LedgerService);
    dashboard(): Promise<{
        totalUsers: number;
        newUsersToday: number;
        totalQr: number;
        todayTxCount: number;
        todayTxAmount: string;
        pendingSettlementAmount: string;
        settledAmount: string;
        failedTxCount: number;
        openExceptionCount: number;
    }>;
    orderChain(orderId: string): Promise<{
        payer: User;
        receiver: User;
        payment: {
            orderNo: string;
            amount: string;
            currency: string;
            transactionId: string;
            status: OrderStatus;
        };
        master: import("../entities/master-account.entity").MasterAccount;
        settlementStatus: string;
        ledgerEntries: import("../entities/ledger-entry.entity").LedgerEntry[];
    } | null>;
    pendingSettlementUsers(): Promise<{
        userId: string;
        realName: string;
        wingAccount: string;
        amount: number;
    }[]>;
}
