import { DataSource, Repository } from 'typeorm';
import { PaymentOrder } from '../entities/payment-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from '../users/users.service';
import { QrService } from '../qr/qr.service';
import { MasterAccountService } from '../master-account/master-account.service';
import { ProviderRegistry } from '../providers/provider-registry';
import { OrderStateMachine } from './order-state-machine';
import { ExceptionQueueService } from '../exception-queue/exception-queue.service';
export declare class PaymentsService {
    private readonly orderRepository;
    private readonly usersService;
    private readonly qrService;
    private readonly masterService;
    private readonly providerRegistry;
    private readonly stateMachine;
    private readonly exceptionQueue;
    private readonly dataSource;
    constructor(orderRepository: Repository<PaymentOrder>, usersService: UsersService, qrService: QrService, masterService: MasterAccountService, providerRegistry: ProviderRegistry, stateMachine: OrderStateMachine, exceptionQueue: ExceptionQueueService, dataSource: DataSource);
    create(dto: CreatePaymentDto): Promise<PaymentOrder>;
    findById(id: string): Promise<PaymentOrder>;
    findAll(): Promise<PaymentOrder[]>;
    findByTransactionId(transactionId: string): Promise<PaymentOrder | null>;
    private generateOrderNo;
}
