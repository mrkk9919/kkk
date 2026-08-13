export interface EmvQrData {
    payloadFormatIndicator?: string;
    pointOfInitiation?: string;
    bakongAccountId: string;
    merchantName: string;
    merchantCity?: string;
    amount?: string;
    currency?: 'KHR' | 'USD';
}
export declare class BakongQrGenerator {
    private static readonly CRC_LENGTH;
    static generate(data: EmvQrData): string;
    static verifyCrc(qrPayload: string): boolean;
    private static tag;
    private static crc16;
}
