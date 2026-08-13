"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BakongQrGenerator = void 0;
class BakongQrGenerator {
    static CRC_LENGTH = 4;
    static generate(data) {
        const poi = data.pointOfInitiation ?? '11';
        const currencyNumeric = (data.currency ?? 'KHR') === 'KHR' ? '116' : '840';
        const merchantCity = data.merchantCity ?? 'Phnom Penh';
        let payload = '';
        payload += this.tag('00', data.payloadFormatIndicator ?? '01');
        payload += this.tag('01', poi);
        const accountTemplate = this.tag('00', data.bakongAccountId);
        payload += this.tag('29', accountTemplate);
        payload += this.tag('52', '5999');
        payload += this.tag('53', currencyNumeric);
        if (data.amount) {
            payload += this.tag('54', data.amount);
        }
        payload += this.tag('58', 'KH');
        payload += this.tag('59', data.merchantName);
        payload += this.tag('60', merchantCity);
        payload += '6304';
        payload += this.crc16(payload);
        return payload;
    }
    static verifyCrc(qrPayload) {
        if (!qrPayload || qrPayload.length <= this.CRC_LENGTH)
            return false;
        const data = qrPayload.slice(0, -this.CRC_LENGTH);
        const receivedCrc = qrPayload.slice(-this.CRC_LENGTH);
        return receivedCrc === this.crc16(data);
    }
    static tag(tag, value) {
        const length = value.length.toString().padStart(2, '0');
        return `${tag}${length}${value}`;
    }
    static crc16(data) {
        let crc = 0xffff;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let bit = 0; bit < 8; bit++) {
                crc =
                    (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
            }
        }
        return crc.toString(16).toUpperCase().padStart(4, '0');
    }
}
exports.BakongQrGenerator = BakongQrGenerator;
//# sourceMappingURL=bakong-qr.generator.js.map