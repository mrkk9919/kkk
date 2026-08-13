import { MasterAccountService } from './master-account.service';
import { CreateMasterAccountDto } from './dto/create-master-account.dto';
export declare class MasterAccountController {
    private readonly masterService;
    constructor(masterService: MasterAccountService);
    create(dto: CreateMasterAccountDto): Promise<{
        master: import("../entities/master-account.entity").MasterAccount;
    }>;
    getActive(): Promise<{
        master: import("../entities/master-account.entity").MasterAccount | null;
    }>;
}
