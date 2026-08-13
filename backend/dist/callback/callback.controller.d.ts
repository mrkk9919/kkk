import { CallbackService } from './callback.service';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
export declare class CallbackController {
    private readonly callbackService;
    constructor(callbackService: CallbackService);
    handlePayment(dto: PaymentCallbackDto, signature: string): Promise<{
        status: string;
        transactionId: string;
    }>;
}
