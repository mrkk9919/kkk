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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_order_entity_1 = require("../entities/payment-order.entity");
const enums_1 = require("../common/enums");
const users_service_1 = require("../users/users.service");
const qr_service_1 = require("../qr/qr.service");
const master_account_service_1 = require("../master-account/master-account.service");
const provider_registry_1 = require("../providers/provider-registry");
const order_state_machine_1 = require("./order-state-machine");
const exception_queue_service_1 = require("../exception-queue/exception-queue.service");
let PaymentsService = class PaymentsService {
    orderRepository;
    usersService;
    qrService;
    masterService;
    providerRegistry;
    stateMachine;
    exceptionQueue;
    dataSource;
    constructor(orderRepository, usersService, qrService, masterService, providerRegistry, stateMachine, exceptionQueue, dataSource) {
        this.orderRepository = orderRepository;
        this.usersService = usersService;
        this.qrService = qrService;
        this.masterService = masterService;
        this.providerRegistry = providerRegistry;
        this.stateMachine = stateMachine;
        this.exceptionQueue = exceptionQueue;
        this.dataSource = dataSource;
    }
    async create(dto) {
        const payer = await this.usersService.findById(dto.payerUserId);
        const receiver = await this.usersService.findById(dto.receiverUserId);
        const qr = await this.qrService.getQrById(dto.qrId);
        if (!qr) {
            throw new common_1.NotFoundException('QR not found');
        }
        if (qr.userId !== receiver.id) {
            throw new common_1.BadRequestException('QR does not belong to the receiver user');
        }
        const master = await this.masterService.findActiveMaster();
        if (!master) {
            throw new common_1.BadRequestException('No active Master Account configured');
        }
        const orderNo = this.generateOrderNo();
        const order = this.orderRepository.create({
            orderNo,
            payerUserId: payer.id,
            receiverUserId: receiver.id,
            qrId: qr.id,
            amount: dto.amount.toFixed(2),
            currency: dto.currency,
            masterAccountId: master.id,
            paymentStatus: enums_1.OrderStatus.CREATED,
        });
        const saved = await this.orderRepository.save(order);
        try {
            const result = await this.providerRegistry.pay({
                orderNo,
                payerAccount: payer.wingAccount,
                receiverAccount: receiver.wingAccount,
                amount: saved.amount,
                currency: saved.currency,
                qrPayload: qr.qrPayload,
            });
            if (result.success && result.transactionId) {
                saved.transactionId = result.transactionId;
                saved.paymentStatus = this.stateMachine.transition(saved.paymentStatus, enums_1.OrderStatus.PAYMENT_PENDING);
            }
            else {
                await this.exceptionQueue.add({
                    category: 'PAYMENT_FAILED',
                    orderId: saved.id,
                    detail: { message: result.message },
                });
                saved.paymentStatus = this.stateMachine.transition(saved.paymentStatus, enums_1.OrderStatus.PAYMENT_FAILED);
            }
            return this.orderRepository.save(saved);
        }
        catch (error) {
            await this.exceptionQueue.add({
                category: 'TIMEOUT',
                orderId: saved.id,
                detail: { message: error.message },
            });
            saved.paymentStatus = enums_1.OrderStatus.PAYMENT_FAILED;
            return this.orderRepository.save(saved);
        }
    }
    async findById(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: {
                payer: true,
                receiver: true,
                qr: true,
                masterAccount: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Payment order not found');
        }
        return order;
    }
    async findAll() {
        return this.orderRepository.find({
            relations: { payer: true, receiver: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findByTransactionId(transactionId) {
        return this.orderRepository.findOne({ where: { transactionId } });
    }
    generateOrderNo() {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `ORD${ts}${rand}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_order_entity_1.PaymentOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        qr_service_1.QrService,
        master_account_service_1.MasterAccountService,
        provider_registry_1.ProviderRegistry,
        order_state_machine_1.OrderStateMachine,
        exception_queue_service_1.ExceptionQueueService,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map