import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { Callback } from '../entities/callback.entity';
import { PaymentOrder } from '../entities/payment-order.entity';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { OrderStateMachine } from '../payments/order-state-machine';
import { ExceptionQueueService } from '../exception-queue/exception-queue.service';
import { PaymentsService } from '../payments/payments.service';
export declare class CallbackService {
    private readonly callbackRepository;
    private readonly orderRepository;
    private readonly configService;
    private readonly stateMachine;
    private readonly exceptionQueue;
    private readonly paymentsService;
    private readonly dataSource;
    private readonly logger;
    constructor(callbackRepository: Repository<Callback>, orderRepository: Repository<PaymentOrder>, configService: ConfigService, stateMachine: OrderStateMachine, exceptionQueue: ExceptionQueueService, paymentsService: PaymentsService, dataSource: DataSource);
    verifySignature(payload: string, signature: string): boolean;
    handlePaymentCallback(dto: PaymentCallbackDto, signature: string): Promise<{
        status: string;
        transactionId: string;
    }>;
    private processPaymentSuccess;
    getCallback(transactionId: string): Promise<Callback | null>;
    private getAccountBalance;
    private postLedgerEntry;
}
