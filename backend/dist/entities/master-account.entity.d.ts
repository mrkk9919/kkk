import { UserStatus } from '../common/enums';
export declare class MasterAccount {
    id: string;
    accountIdentifier: string;
    phone: string;
    qrPayload: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}
