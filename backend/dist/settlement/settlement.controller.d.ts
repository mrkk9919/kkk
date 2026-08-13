import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
export declare class SettlementController {
    private readonly settlementService;
    constructor(settlementService: SettlementService);
    create(dto: CreateSettlementDto): Promise<{
        settlement: import("../entities/settlement-record.entity").SettlementRecord;
    }>;
    findAll(): Promise<{
        settlements: import("../entities/settlement-record.entity").SettlementRecord[];
    }>;
    findById(id: string): Promise<{
        settlement: import("../entities/settlement-record.entity").SettlementRecord;
    }>;
}
