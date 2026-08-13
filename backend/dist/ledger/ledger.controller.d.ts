import { LedgerService } from './ledger.service';
export declare class LedgerController {
    private readonly ledgerService;
    constructor(ledgerService: LedgerService);
    getForUser(id: string): Promise<{
        entries: import("../entities/ledger-entry.entity").LedgerEntry[];
    }>;
    getMaster(): Promise<{
        entries: import("../entities/ledger-entry.entity").LedgerEntry[];
    }>;
}
