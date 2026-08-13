import { Request } from 'express';
export interface AuditRecord {
    adminId?: string;
    action: string;
    targetType: string;
    targetId?: string;
    ip?: string;
}
export declare class AuditLogger {
    private readonly logger;
    log(record: AuditRecord): void;
    static extractIp(request: Request): string;
}
