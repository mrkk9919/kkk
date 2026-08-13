import { Repository } from 'typeorm';
import { ExceptionQueue } from '../entities/exception-queue.entity';
import { ExceptionCategory, ExceptionStatus } from '../common/enums';
export interface AddExceptionInput {
    category: ExceptionCategory | string;
    orderId?: string;
    transactionId?: string;
    detail?: Record<string, unknown>;
}
export declare class ExceptionQueueService {
    private readonly exceptionRepository;
    constructor(exceptionRepository: Repository<ExceptionQueue>);
    add(input: AddExceptionInput): Promise<ExceptionQueue>;
    findAll(status?: ExceptionStatus): Promise<ExceptionQueue[]>;
    resolve(id: string): Promise<ExceptionQueue>;
}
