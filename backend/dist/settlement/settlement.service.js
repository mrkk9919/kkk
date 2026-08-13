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
exports.SettlementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settlement_record_entity_1 = require("../entities/settlement-record.entity");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const ledger_entry_entity_1 = require("../entities/ledger-entry.entity");
const enums_1 = require("../common/enums");
const provider_registry_1 = require("../providers/provider-registry");
const order_state_machine_1 = require("../payments/order-state-machine");
const exception_queue_service_1 = require("../exception-queue/exception-queue.service");
const users_service_1 = require("../users/users.service");
const ledger_service_1 = require("../ledger/ledger.service");
let SettlementService = class SettlementService {
    settlementRepository;
    orderRepository;
    ledgerRepository;
    providerRegistry;
    stateMachine;
    exceptionQueue;
    usersService;
    ledgerService;
    dataSource;
    constructor(settlementRepository, orderRepository, ledgerRepository, providerRegistry, stateMachine, exceptionQueue, usersService, ledgerService, dataSource) {
        this.settlementRepository = settlementRepository;
        this.orderRepository = orderRepository;
        this.ledgerRepository = ledgerRepository;
        this.providerRegistry = providerRegistry;
        this.stateMachine = stateMachine;
        this.exceptionQueue = exceptionQueue;
        this.usersService = usersService;
        this.ledgerService = ledgerService;
        this.dataSource = dataSource;
    }
    async create(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: { receiver: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Payment order not found');
        }
        const existing = await this.settlementRepository.findOne({
            where: { orderId: order.id },
        });
        if (existing) {
            throw new common_1.BadRequestException('Settlement already exists for this order');
        }
        if (order.paymentStatus !== enums_1.OrderStatus.PAYMENT_SUCCESS &&
            order.paymentStatus !== enums_1.OrderStatus.MASTER_RECEIVED) {
            throw new common_1.BadRequestException('Order is not in a payable state for settlement');
        }
        return this.dataSource.transaction(async (manager) => {
            const orderRepo = manager.getRepository(payment_order_entity_1.PaymentOrder);
            const settlementRepo = manager.getRepository(settlement_record_entity_1.SettlementRecord);
            const ledgerRepo = manager.getRepository(ledger_entry_entity_1.LedgerEntry);
            const latest = await orderRepo.findOne({
                where: { id: order.id },
                lock: { mode: 'pessimistic_write' },
            });
            if (!latest)
                throw new common_1.NotFoundException('Payment order not found');
            const receiver = await this.usersService.findById(latest.receiverUserId);
            const nextStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.MASTER_RECEIVED);
            latest.paymentStatus = nextStatus;
            latest.settlementStatus = 'SETTLEMENT_PENDING';
            await orderRepo.save(latest);
            const destination = `${receiver.wingAccount}`;
            const record = settlementRepo.create({
                orderId: latest.id,
                userId: latest.receiverUserId,
                amount: latest.amount,
                destination,
                status: enums_1.SettlementRecordStatus.SETTLEMENT_PENDING,
            });
            const saved = await settlementRepo.save(record);
            try {
                latest.paymentStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.SETTLEMENT_PENDING);
                latest.settlementStatus = 'SETTLEMENT_PENDING';
                latest.paymentStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.SETTLEMENT_PROCESSING);
                latest.settlementStatus = 'SETTLEMENT_PROCESSING';
                await orderRepo.save(latest);
                const result = await this.providerRegistry.settle({
                    amount: latest.amount,
                    currency: latest.currency,
                    destination,
                    orderNo: latest.orderNo,
                });
                if (result.success) {
                    saved.status = enums_1.SettlementRecordStatus.SETTLEMENT_SUCCESS;
                    saved.providerTransactionId =
                        result.providerTransactionId ?? null;
                    saved.completedAt = new Date();
                    await settlementRepo.save(saved);
                    latest.paymentStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.SETTLEMENT_SUCCESS);
                    latest.settlementStatus = 'SETTLEMENT_SUCCESS';
                    latest.settledAt = new Date();
                    await orderRepo.save(latest);
                    await this.markReceivableSettled(ledgerRepo, latest, saved);
                }
                else {
                    latest.paymentStatus = this.stateMachine.transition(latest.paymentStatus, enums_1.OrderStatus.SETTLEMENT_FAILED);
                    latest.settlementStatus = 'SETTLEMENT_FAILED';
                    await orderRepo.save(latest);
                    saved.status = enums_1.SettlementRecordStatus.SETTLEMENT_FAILED;
                    await settlementRepo.save(saved);
                    await this.exceptionQueue.add({
                        category: 'SETTLEMENT_FAILED',
                        orderId: latest.id,
                        transactionId: latest.transactionId,
                        detail: { message: result.message },
                    });
                }
            }
            catch (error) {
                latest.paymentStatus = enums_1.OrderStatus.SETTLEMENT_FAILED;
                latest.settlementStatus = 'SETTLEMENT_FAILED';
                await orderRepo.save(latest);
                saved.status = enums_1.SettlementRecordStatus.SETTLEMENT_FAILED;
                await settlementRepo.save(saved);
                await this.exceptionQueue.add({
                    category: 'SETTLEMENT_FAILED',
                    orderId: latest.id,
                    transactionId: latest.transactionId,
                    detail: { message: error.message },
                });
            }
            return saved;
        });
    }
    async markReceivableSettled(ledgerRepo, order, record) {
        await ledgerRepo.update({
            transactionId: order.transactionId,
            userId: order.receiverUserId,
            entryType: enums_1.EntryType.RECEIVABLE,
        }, { status: enums_1.LedgerStatus.SETTLED });
        const last = await ledgerRepo
            .createQueryBuilder('ledger')
            .where('ledger.account_type = :accountType', {
            accountType: enums_1.AccountType.USER,
        })
            .andWhere('ledger.user_id = :userId', { userId: order.receiverUserId })
            .orderBy('ledger.created_at', 'DESC')
            .take(1)
            .getOne();
        const balanceBefore = last ? Number(last.balanceAfter) : 0;
        await ledgerRepo.save(ledgerRepo.create({
            transactionId: order.transactionId,
            accountType: enums_1.AccountType.USER,
            userId: order.receiverUserId,
            entryType: enums_1.EntryType.SETTLEMENT_OUT,
            amount: record.amount,
            balanceBefore: balanceBefore.toFixed(2),
            balanceAfter: (balanceBefore - Number(record.amount)).toFixed(2),
            status: enums_1.LedgerStatus.SETTLED,
        }));
    }
    async findAll() {
        return this.settlementRepository.find({
            relations: { order: true, user: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const record = await this.settlementRepository.findOne({
            where: { id },
            relations: { order: true, user: true },
        });
        if (!record) {
            throw new common_1.NotFoundException('Settlement record not found');
        }
        return record;
    }
    async batchSettleForUser(userId) {
        const user = await this.usersService.findById(userId);
        const orders = await this.orderRepository.find({
            where: { receiverUserId: user.id },
        });
        const results = [];
        for (const order of orders) {
            const existing = await this.settlementRepository.findOne({
                where: { orderId: order.id },
            });
            if (existing && existing.status === enums_1.SettlementRecordStatus.SETTLEMENT_SUCCESS) {
                continue;
            }
            if (order.paymentStatus === enums_1.OrderStatus.PAYMENT_SUCCESS ||
                order.paymentStatus === enums_1.OrderStatus.MASTER_RECEIVED) {
                const record = await this.create(order.id);
                results.push(record);
            }
        }
        return results;
    }
};
exports.SettlementService = SettlementService;
exports.SettlementService = SettlementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settlement_record_entity_1.SettlementRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_order_entity_1.PaymentOrder)),
    __param(2, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        provider_registry_1.ProviderRegistry,
        order_state_machine_1.OrderStateMachine,
        exception_queue_service_1.ExceptionQueueService,
        users_service_1.UsersService,
        ledger_service_1.LedgerService,
        typeorm_2.DataSource])
], SettlementService);
//# sourceMappingURL=settlement.service.js.map