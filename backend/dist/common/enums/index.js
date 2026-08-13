"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionStatus = exports.ExceptionCategory = exports.SettlementRecordStatus = exports.CallbackStatus = exports.CallbackType = exports.LedgerStatus = exports.EntryType = exports.AccountType = exports.OrderStatus = exports.SettlementStatus = exports.PaymentStatus = exports.QrStatus = exports.QrType = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["DISABLED"] = "DISABLED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var QrType;
(function (QrType) {
    QrType["MASTER"] = "MASTER";
    QrType["PERSONAL"] = "PERSONAL";
})(QrType || (exports.QrType = QrType = {}));
var QrStatus;
(function (QrStatus) {
    QrStatus["ACTIVE"] = "ACTIVE";
    QrStatus["INACTIVE"] = "INACTIVE";
})(QrStatus || (exports.QrStatus = QrStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["CREATED"] = "CREATED";
    PaymentStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    PaymentStatus["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    PaymentStatus["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    PaymentStatus["MASTER_RECEIVED"] = "MASTER_RECEIVED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["NONE"] = "NONE";
    SettlementStatus["SETTLEMENT_PENDING"] = "SETTLEMENT_PENDING";
    SettlementStatus["SETTLEMENT_PROCESSING"] = "SETTLEMENT_PROCESSING";
    SettlementStatus["SETTLEMENT_SUCCESS"] = "SETTLEMENT_SUCCESS";
    SettlementStatus["SETTLEMENT_FAILED"] = "SETTLEMENT_FAILED";
})(SettlementStatus || (exports.SettlementStatus = SettlementStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    OrderStatus["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    OrderStatus["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    OrderStatus["MASTER_RECEIVED"] = "MASTER_RECEIVED";
    OrderStatus["SETTLEMENT_PENDING"] = "SETTLEMENT_PENDING";
    OrderStatus["SETTLEMENT_PROCESSING"] = "SETTLEMENT_PROCESSING";
    OrderStatus["SETTLEMENT_SUCCESS"] = "SETTLEMENT_SUCCESS";
    OrderStatus["SETTLEMENT_FAILED"] = "SETTLEMENT_FAILED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["REVERSED"] = "REVERSED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var AccountType;
(function (AccountType) {
    AccountType["MASTER"] = "MASTER";
    AccountType["USER"] = "USER";
})(AccountType || (exports.AccountType = AccountType = {}));
var EntryType;
(function (EntryType) {
    EntryType["INCOME"] = "INCOME";
    EntryType["RECEIVABLE"] = "RECEIVABLE";
    EntryType["SETTLEMENT_OUT"] = "SETTLEMENT_OUT";
})(EntryType || (exports.EntryType = EntryType = {}));
var LedgerStatus;
(function (LedgerStatus) {
    LedgerStatus["PENDING_SETTLEMENT"] = "PENDING_SETTLEMENT";
    LedgerStatus["SETTLED"] = "SETTLED";
})(LedgerStatus || (exports.LedgerStatus = LedgerStatus = {}));
var CallbackType;
(function (CallbackType) {
    CallbackType["PAYMENT"] = "PAYMENT";
    CallbackType["SETTLEMENT"] = "SETTLEMENT";
})(CallbackType || (exports.CallbackType = CallbackType = {}));
var CallbackStatus;
(function (CallbackStatus) {
    CallbackStatus["RECEIVED"] = "RECEIVED";
    CallbackStatus["VERIFIED"] = "VERIFIED";
    CallbackStatus["PROCESSED"] = "PROCESSED";
    CallbackStatus["REJECTED"] = "REJECTED";
})(CallbackStatus || (exports.CallbackStatus = CallbackStatus = {}));
var SettlementRecordStatus;
(function (SettlementRecordStatus) {
    SettlementRecordStatus["SETTLEMENT_PENDING"] = "SETTLEMENT_PENDING";
    SettlementRecordStatus["SETTLEMENT_PROCESSING"] = "SETTLEMENT_PROCESSING";
    SettlementRecordStatus["SETTLEMENT_SUCCESS"] = "SETTLEMENT_SUCCESS";
    SettlementRecordStatus["SETTLEMENT_FAILED"] = "SETTLEMENT_FAILED";
})(SettlementRecordStatus || (exports.SettlementRecordStatus = SettlementRecordStatus = {}));
var ExceptionCategory;
(function (ExceptionCategory) {
    ExceptionCategory["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    ExceptionCategory["TIMEOUT"] = "TIMEOUT";
    ExceptionCategory["DUP_CALLBACK"] = "DUP_CALLBACK";
    ExceptionCategory["SIGNATURE_MISMATCH"] = "SIGNATURE_MISMATCH";
    ExceptionCategory["AMOUNT_MISMATCH"] = "AMOUNT_MISMATCH";
    ExceptionCategory["NOT_FOUND"] = "NOT_FOUND";
    ExceptionCategory["SETTLEMENT_FAILED"] = "SETTLEMENT_FAILED";
    ExceptionCategory["REVERSAL"] = "REVERSAL";
    ExceptionCategory["REFUND"] = "REFUND";
})(ExceptionCategory || (exports.ExceptionCategory = ExceptionCategory = {}));
var ExceptionStatus;
(function (ExceptionStatus) {
    ExceptionStatus["OPEN"] = "OPEN";
    ExceptionStatus["RESOLVED"] = "RESOLVED";
})(ExceptionStatus || (exports.ExceptionStatus = ExceptionStatus = {}));
//# sourceMappingURL=index.js.map