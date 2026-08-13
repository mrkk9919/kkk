import { DataSource, Repository } from 'typeorm';
import { LedgerEntry } from '../entities/ledger-entry.entity';
import { AccountType, EntryType } from '../common/enums';
import { UsersService } from '../users/users.service';
export interface LedgerPostInput {
    transactionId: string;
    accountType: AccountType;
    userId?: string;
    entryType: EntryType;
    amount: string;
}
export declare class LedgerService {
    private readonly ledgerRepository;
    private readonly usersService;
    private readonly dataSource;
    constructor(ledgerRepository: Repository<LedgerEntry>, usersService: UsersService, dataSource: DataSource);
    post(input: LedgerPostInput): Promise<LedgerEntry>;
    getEntriesForUser(userId: string): Promise<LedgerEntry[]>;
    getMasterEntries(): Promise<LedgerEntry[]>;
    getEntriesForOrder(transactionId: string): Promise<LedgerEntry[]>;
    getBalance(userId: string): Promise<number>;
    getUserReceivable(userId: string): Promise<number>;
}
