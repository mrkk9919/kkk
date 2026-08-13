import { UserStatus } from '../common/enums';
export declare class User {
    id: string;
    wingAccount: string;
    realName: string;
    phone: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}
