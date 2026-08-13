import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto): Promise<{
        order: import("../entities/payment-order.entity").PaymentOrder;
    }>;
    findAll(): Promise<{
        orders: import("../entities/payment-order.entity").PaymentOrder[];
    }>;
    findById(id: string): Promise<{
        order: import("../entities/payment-order.entity").PaymentOrder;
    }>;
}
