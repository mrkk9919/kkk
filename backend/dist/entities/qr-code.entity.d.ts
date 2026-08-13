import { QrStatus, QrType } from '../common/enums';
import { User } from './user.entity';
export declare class QrCode {
    id: string;
    userId: string;
    user: User;
    qrType: QrType;
    qrPayload: string;
    qrImage: string;
    status: QrStatus;
    createdAt: Date;
    updatedAt: Date;
}
