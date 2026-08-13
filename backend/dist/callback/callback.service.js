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
exports.CallbackService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const callback_entity_1 = require("../entities/callback.entity");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const ledger_entry_entity_1 = require("../entities/ledger-entry.entity");
const enums_1 = require("../common/enums");
const order_state_machine_1 = require("../payments/order-state-machine");
const exception_queue_service_1 = require("../exception-queue/exception-queue.service");
const payments_service_1 = require("../payments/payments.service");
let CallbackService = class CallbackService {
    callbackRepository;
    orderRepository;
    configService;
    stateMachine;
    exceptionQueue;
    paymentsService;
    dataSource;
    logger = new common_1.Logger('CallbackService');
    constructor(callbackRepository, orderRepository, configService, stateMachine, exceptionQueue, paymentsService, dataSource) {
        this.callbackRepository = callbackRepository;
        this.orderRepository = orderRepository;
        this.configService = configService;
        this.stateMachine = stateMachine;
        this.exceptionQueue = exceptionQueue;
        this.paymentsService = paymentsService;
        this.dataSource = dataSource;
    }
    verifySignature(payload, signature) {
        const secret = this.configService.get('WEBHOOK_SECRET', '');
        const expected = (0, crypto_1.createHmac)('sha256', secret)
            .update(payload)
            .digest('hex');
        if (expected.length !== signature.length)
            return false;
        return (0, crypto_1.timingSafeEqual)(Buffer.from(expected), Buffer.from(signature));
    }
    async handlePaymentCallback(dto, signature) {
        const rawPayload = JSON.stringify(dto);
        const existingCallback = await this.callbackRepository.findOne({
            where: { transactionId: dto.transactionId },
        });
        if (existingCallback && existingCallback.status !== enums_1.CallbackStatus.REJECTED) {
            this.logger.warn(`Duplicate callback ignored: ${dto.transactionId}`);
            return { status: 'IGNORED', transactionId: dto.transactionId };
        }
        const callback = existingCallback
            ? existingCallback
            : this.callbackRepository.create({
                transactionId: dto.transactionId,
                callbackType: enums_1.CallbackType.PAYMENT,
                receivedAt: new Date(),
            });
        callback.payload = dto;
        callback.signature = signature;
        callback.status = enums_1.CallbackStatus.RECEIVED;
        await this.callbackRepository.save(callback);
        if (!this.verifySignature(rawPayload, signature)) {
            await this.exceptionQueue.add({
                category: 'SIGNATURE_MISMATCH',
                transactionId: dto.transactionId,
                detail: { reason: 'signature verification failed' },
            });
            callback.status = enums_1.CallbackStatus.REJECTED;
            await this.callbackRepository.save(callback);
            throw new common_1.BadRequestException('Invalid callback signature');
        }
        if (dto.status !== 'SUCCESS') {
            callback.status = enums_1.CallbackStatus.REJECTED;
            await this.callbackRepository.save(callback);
            return { status: 'NOT_SUCCESS', transactionId: dto.transactionId };
        }
        return this.processPaymentSuccess(dto, callback);
    }
    async processPaymentSuccess(dto, callback) {
        const order = await this.orderRepository.findOne({
            where: { transactionId: dto.transactionId },
            relations: { receiver: true },
        });
        if (!order) {
            await this.exceptionQueue.add({
                category: 'NOT_FOUND',
                transactionId: dto.transactionId,
                detail: { reason: 'order not found for transaction' },
            });
            callback.status = enums_1.CallbackStatus.REJECTED;
            await this.callbackRepository.save(callback);
            throw new common_1.BadRequestException('Order not found for transaction');
        }
        if (Number(order.amount) !== Number(dto.amount)) {
            await this.exceptionQueue.add({
                category: 'AMOUNT_MISMATCH',
                orderId: order.id,
                transactionId: dto.transactionId,
                detail: {
                    orderAmount: order.amount,
                    callbackAmount: dto.amount,
                },
            });
            callback.status = enums_1.CallbackStatus.REJECTED;
            await this.callbackRepository.save(callback);
            throw new common_1.BadRequestException('Callback amount mismatch');
        }
        if (dto.receiver !== order.receiver.wingAccount) {
            await this.exceptionQueue.add({
                category: 'NOT_FOUND',
                orderId: order.id,
                transactionId: dto.transactionId,
                detail: { reason: 'receiver mismatch' },
            });
            callback.status = enums_1.CallbackStatus.REJECTED;
            await this.callbackRepository.save(callback);
            throw new common_1.BadRequestException('Callback receiver mismatch');
        }
        await this.dataSource.transaction(async (manager) => {
            const orderRepo = manager.getRepository(payment_order_entity_1.PaymentOrder);
            const ledgerRepo = manager.getRepository(ledger_entry_entity_1.LedgerEntry);
            const latest = await orderRepo.findOne({
                where: { id: order.id },
                lock: { mode: 'pessimistic_write' },
            });
            if (!latest) {
                throw new common_1.BadRequestException('Order not found');
            }
            if (latest.paymentStatus === enums_1.OrderStatus.PAYMENT_SUCCESS ||
                latest.paymentStatus === enums_1.OrderStatus.MASTER_RECEIVED) {
                return;
            }
            const nextStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.PAYMENT_SUCCESS);
            latest.paymentStatus = nextStatus;
            latest.paidAt = new Date(dto.timestamp) || new Date();
            await orderRepo.save(latest);
            const amount = Number(latest.amount).toFixed(2);
            const masterBalanceBefore = await this.getAccountBalance(ledgerRepo, enums_1.AccountType.MASTER, null);
            await this.postLedgerEntry(ledgerRepo, {
                transactionId: dto.transactionId,
                accountType: enums_1.AccountType.MASTER,
                entryType: enums_1.EntryType.INCOME,
                userId: null,
                amount,
                status: enums_1.LedgerStatus.SETTLED,
            }, masterBalanceBefore);
            const userBalanceBefore = await this.getAccountBalance(ledgerRepo, enums_1.AccountType.USER, latest.receiverUserId);
            await this.postLedgerEntry(ledgerRepo, {
                transactionId: dto.transactionId,
                accountType: enums_1.AccountType.USER,
                entryType: enums_1.EntryType.RECEIVABLE,
                userId: latest.receiverUserId,
                amount,
                status: enums_1.LedgerStatus.PENDING_SETTLEMENT,
            }, userBalanceBefore);
        });
        callback.status = enums_1.CallbackStatus.PROCESSED;
        callback.processedAt = new Date();
        await this.callbackRepository.save(callback);
        return { status: 'SUCCESS', transactionId: dto.transactionId };
    }
    async getCallback(transactionId) {
        return this.callbackRepository.findOne({ where: { transactionId } });
    }
    async getAccountBalance(repo, accountType, userId) {
        const query = repo
            .createQueryBuilder('ledger')
            .where('ledger.account_type = :accountType', { accountType })
            .orderBy('ledger.created_at', 'DESC')
            .take(1);
        if (accountType === enums_1.AccountType.USER && userId) {
            query.andWhere('ledger.user_id = :userId', { userId });
        }
        const last = await query.getOne();
        return last ? Number(last.balanceAfter) : 0;
    }
    async postLedgerEntry(repo, input, balanceBefore) {
        const amount = Number(input.amount);
        const entry = repo.create({
            transactionId: input.transactionId,
            accountType: input.accountType,
            userId: input.userId,
            entryType: input.entryType,
            amount: amount.toFixed(2),
            balanceBefore: balanceBefore.toFixed(2),
            balanceAfter: (balanceBefore + amount).toFixed(2),
            status: input.status,
        });
        return repo.save(entry);
    }
};
exports.CallbackService = CallbackService;
exports.CallbackService = CallbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(callback_entity_1.Callback)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_order_entity_1.PaymentOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        order_state_machine_1.OrderStateMachine,
        exception_queue_service_1.ExceptionQueueService,
        payments_service_1.PaymentsService,
        typeorm_2.DataSource])
], CallbackService);
//# sourceMappingURL=callback.service.js.map