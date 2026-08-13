import { DataSource, Repository } from 'typeorm';
import { SettlementRecord } from '../entities/settlement-record.entity';
import { PaymentOrder } from '../entities/payment-order.entity';
import { LedgerEntry } from '../entities/ledger-entry.entity';
import { ProviderRegistry } from '../providers/provider-registry';
import { OrderStateMachine } from '../payments/order-state-machine';
import { ExceptionQueueService } from '../exception-queue/exception-queue.service';
import { UsersService } from '../users/users.service';
import { LedgerService } from '../ledger/ledger.service';
export declare class SettlementService {
    private readonly settlementRepository;
    private readonly orderRepository;
    private readonly ledgerRepository;
    private readonly providerRegistry;
    private readonly stateMachine;
    private readonly exceptionQueue;
    private readonly usersService;
    private readonly ledgerService;
    private readonly dataSource;
    constructor(settlementRepository: Repository<SettlementRecord>, orderRepository: Repository<PaymentOrder>, ledgerRepository: Repository<LedgerEntry>, providerRegistry: ProviderRegistry, stateMachine: OrderStateMachine, exceptionQueue: ExceptionQueueService, usersService: UsersService, ledgerService: LedgerService, dataSource: DataSource);
    create(orderId: string): Promise<SettlementRecord>;
    private markReceivableSettled;
    findAll(): Promise<SettlementRecord[]>;
    findById(id: string): Promise<SettlementRecord>;
    batchSettleForUser(userId: string): Promise<SettlementRecord[]>;
}
