import { CallbackStatus, CallbackType } from '../common/enums';
export declare class Callback {
    id: string;
    transactionId: string;
    callbackType: CallbackType;
    payload: Record<string, unknown>;
    signature: string;
    status: CallbackStatus;
    receivedAt: Date;
    processedAt: Date;
}
