import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
export interface AuditLogInput {
    adminId?: string;
    action: string;
    targetType: string;
    targetId?: string;
    ip?: string;
}
export declare class AuditService {
    private readonly auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    record(input: AuditLogInput): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
}
