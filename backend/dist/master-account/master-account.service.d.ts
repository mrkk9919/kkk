import { Repository } from 'typeorm';
import { MasterAccount } from '../entities/master-account.entity';
import { CreateMasterAccountDto } from './dto/create-master-account.dto';
export declare class MasterAccountService {
    private readonly masterRepository;
    constructor(masterRepository: Repository<MasterAccount>);
    create(dto: CreateMasterAccountDto): Promise<MasterAccount>;
    findActiveMaster(): Promise<MasterAccount | null>;
    findById(id: string): Promise<MasterAccount>;
}
