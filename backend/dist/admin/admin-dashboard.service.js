"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const qr_code_entity_1 = require("../entities/qr-code.entity");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const exception_queue_entity_1 = require("../entities/exception-queue.entity");
const enums_1 = require("../common/enums");
const ledger_service_1 = require("../ledger/ledger.service");
let AdminDashboardService = class AdminDashboardService {
    userRepository;
    qrRepository;
    orderRepository;
    exceptionRepository;
    ledgerService;
    constructor(userRepository, qrRepository, orderRepository, exceptionRepository, ledgerService) {
        this.userRepository = userRepository;
        this.qrRepository = qrRepository;
        this.orderRepository = orderRepository;
        this.exceptionRepository = exceptionRepository;
        this.ledgerService = ledgerService;
    }
    async dashboard() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const totalUsers = await this.userRepository.count();
        const newUsersToday = await this.userRepository
            .createQueryBuilder('u')
            .where('u.created_at >= :start', { start: startOfToday })
            .getCount();
        const totalQr = await this.qrRepository.count();
        const todayOrders = await this.orderRepository
            .createQueryBuilder('o')
            .where('o.created_at >= :start', { start: startOfToday })
            .getMany();
        const todayTxCount = todayOrders.length;
        const todayTxAmount = todayOrders.reduce((sum, order) => sum + Number(order.amount), 0);
        const successfulOrders = await this.orderRepository.find({
            where: { paymentStatus: enums_1.OrderStatus.PAYMENT_SUCCESS },
        });
        const pendingSettlement = successfulOrders.reduce((sum, order) => {
            return order.settlementStatus === 'SETTLEMENT_PENDING'
                ? sum + Number(order.amount)
                : sum;
        }, 0);
        const settledOrders = await this.orderRepository.find({
            where: { settlementStatus: 'SETTLEMENT_SUCCESS' },
        });
        const settledAmount = settledOrders.reduce((sum, order) => sum + Number(order.amount), 0);
        const failedOrders = await this.orderRepository.find({
            where: { paymentStatus: enums_1.OrderStatus.PAYMENT_FAILED },
        });
        const abnormalCallbacks = await this.exceptionRepository.find({
            where: { status: enums_1.ExceptionStatus.OPEN },
        });
        return {
            totalUsers,
            newUsersToday,
            totalQr,
            todayTxCount,
            todayTxAmount: todayTxAmount.toFixed(2),
            pendingSettlementAmount: pendingSettlement.toFixed(2),
            settledAmount: settledAmount.toFixed(2),
            failedTxCount: failedOrders.length,
            openExceptionCount: abnormalCallbacks.length,
        };
    }
    async orderChain(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: {
                payer: true,
                receiver: true,
                qr: true,
                masterAccount: true,
            },
        });
        if (!order) {
            return null;
        }
        const ledgerEntries = order.transactionId
            ? await this.ledgerService.getEntriesForOrder(order.transactionId)
            : [];
        return {
            payer: order.payer,
            receiver: order.receiver,
            payment: {
                orderNo: order.orderNo,
                amount: order.amount,
                currency: order.currency,
                transactionId: order.transactionId,
                status: order.paymentStatus,
            },
            master: order.masterAccount,
            settlementStatus: order.settlementStatus,
            ledgerEntries,
        };
    }
    async pendingSettlementUsers() {
        const orders = await this.orderRepository.find({
            where: { settlementStatus: 'SETTLEMENT_PENDING' },
            relations: { receiver: true },
        });
        const summary = new Map();
        for (const order of orders) {
            const key = order.receiverUserId;
            const existing = summary.get(key) ?? {
                userId: order.receiver.id,
                realName: order.receiver.realName,
                wingAccount: order.receiver.wingAccount,
                amount: 0,
            };
            existing.amount += Number(order.amount);
            summary.set(key, existing);
        }
        return Array.from(summary.values());
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(qr_code_entity_1.QrCode)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_order_entity_1.PaymentOrder)),
    __param(3, (0, typeorm_1.InjectRepository)(exception_queue_entity_1.ExceptionQueue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ledger_service_1.LedgerService])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map