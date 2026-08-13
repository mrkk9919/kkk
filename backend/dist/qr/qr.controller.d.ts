import { QrService } from './qr.service';
export declare class QrController {
    private readonly qrService;
    constructor(qrService: QrService);
    getQr(id: string): Promise<{
        qr: import("../entities/qr-code.entity").QrCode | null;
    }>;
}
