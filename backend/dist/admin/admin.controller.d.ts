import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminController {
    private readonly dashboardService;
    constructor(dashboardService: AdminDashboardService);
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
    orderChain(id: string): Promise<{
        chain: {
            payer: import("../entities/user.entity").User;
            receiver: import("../entities/user.entity").User;
            payment: {
                orderNo: string;
                amount: string;
                currency: string;
                transactionId: string;
                status: import("../common/enums").OrderStatus;
            };
            master: import("../entities/master-account.entity").MasterAccount;
            settlementStatus: string;
            ledgerEntries: import("../entities/ledger-entry.entity").LedgerEntry[];
        } | null;
    }>;
    pendingSettlements(): Promise<{
        users: {
            userId: string;
            realName: string;
            wingAccount: string;
            amount: number;
        }[];
    }>;
}
