import { AccountType, EntryType, LedgerStatus } from '../common/enums';
export declare class LedgerEntry {
    id: string;
    transactionId: string;
    userId: string | null;
    accountType: AccountType;
    entryType: EntryType;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    status: LedgerStatus;
    createdAt: Date;
}
