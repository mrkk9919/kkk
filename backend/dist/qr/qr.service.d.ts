import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
export declare class QrService {
    private readonly qrRepository;
    constructor(qrRepository: Repository<QrCode>);
    generatePersonalQr(userId: string, wingAccount: string, merchantName?: string): Promise<QrCode>;
    getQrById(id: string): Promise<QrCode | null>;
    getPersonalQrByUser(userId: string): Promise<QrCode | null>;
    getActivePersonalQr(userId: string): Promise<QrCode | null>;
}
