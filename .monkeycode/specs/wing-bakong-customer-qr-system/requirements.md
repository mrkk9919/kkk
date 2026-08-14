# Requirements Document

## Introduction

WING BANK + BAKONG 客户专属二维码系统。系统从已绑定的 Wing 后台/API 自动同步新客户资料（实名、KYC、USD/KHR 账户），为每位客户自动生成 USD 与 KHR 专属收款二维码；其他用户扫码后经 BAKONG/银行正式支付流程完成付款，支付成功后通过 Callback 验证交易、识别收款客户、记账并完成结算。

Wing 负责：客户注册、实名、KYC、USD Account、KHR Account。
本系统负责：客户同步、客户二维码、BAKONG/银行支付接口、Payment Callback、交易记录、Ledger、Settlement、后台管理。

## Glossary

- **Wing Customer**: 在 Wing 后台完成注册并通过 KYC 的客户，拥有唯一 Customer ID 与 USD/KHR 两个账户。
- **Customer QR**: 系统为 Wing 客户生成的专属收款二维码，按币种分为 USD QR 与 KHR QR。
- **Master Account**: 系统配置的资金归集账户，接收正式支付渠道到账资金，不代替客户真实身份。
- **Payer (B 用户)**: 扫描客户二维码并执行付款的用户。
- **Receiver (C 用户)**: 拥有专属二维码并接收付款的 Wing 客户。
- **Transaction ID**: 正式支付机构/银行在支付成功回调中提供的唯一交易标识。
- **Callback**: 正式支付机构/银行对支付结果的通知，需校验签名与字段。
- **Ledger**: 系统账本，记录每笔交易对 Master 账户与客户账户的借贷影响。
- **Settlement**: 将已确认收款从待结算状态转化为客户可用余额的正式结算流程。

## Requirements

### 1. Wing 客户资料同步

**User Story:** AS 系统管理员, I want 自动同步 Wing 新注册客户资料, so that 客户无需手工录入即可生成专属二维码。

#### Acceptance Criteria

1. WHEN Wing 后台新增已绑定客户，系统 SHALL 读取该客户的 Customer ID、Real Name、KYC Status、Phone、Wing USD Account、Wing KHR Account、Registration Time、Account Status。
2. WHEN 读取的客户资料包含完整必填字段，系统 SHALL 创建客户资料（users 表），并保证 Customer ID 唯一。
3. WHEN Wing 客户账户状态发生变化，系统 SHALL 同步更新客户账户状态。
4. IF Wing 接口不可用或返回异常，系统 SHALL 将同步失败记录到异常队列并支持重试。
5. 系统 SHALL 记录每次同步操作的来源与时间。

### 2. 客户专属二维码生成

**User Story:** AS 系统管理员, I want 每个 Wing 客户自动获得 USD 与 KHR 专属收款二维码, so that 客户可展示并接收对应币种付款。

#### Acceptance Criteria

1. WHEN 系统创建客户资料，系统 SHALL 自动生成该客户的 USD QR 与 KHR QR 两条二维码记录。
2. WHEN 生成二维码，系统 SHALL 使用 BAKONG/银行正式支持的 QR Payload 标准，禁止仅凭客户姓名与账户信息拼接伪造支付二维码。
3. 二维码中展示的收款人姓名 SHALL 与实际收款账户实名保持一致。
4. 每条二维码记录 SHALL 包含 QR ID、所属客户、币种、Wing 账户、QR Payload、QR 图片与状态。
5. WHEN 管理员对二维码执行启用/停用/重新生成操作，系统 SHALL 更新对应二维码状态或生成新 Payload。
6. 系统 SHALL 支持管理员查看与下载客户二维码图片。

### 3. 扫码付款

**User Story:** AS B 用户, I want 扫描 C 用户二维码后通过正式支付渠道付款, so that 支付页显示真实收款人与金额。

#### Acceptance Criteria

1. WHEN B 用户扫描客户二维码，系统 SHALL 依据二维码对应币种与收款账户创建支付会话。
2. 支付页面 SHALL 显示收款人真实姓名（与收款账户实名一致）以及 B 用户输入的付款金额与币种（USD 或 KHR）。
3. WHEN B 用户确认付款，系统 SHALL 通过 BAKONG/银行正式支付流程执行真实支付，资金到账至 Master Account。
4. 系统 SHALL 记录每次付款生成的 Payment Order，包含订单号、付款人、收款人、金额、币种、QR ID、Master Account 与状态。

### 4. Payment Callback 验证与幂等

**User Story:** AS 系统, I want 验证支付回调并防止重复入账, so that 每笔交易只记账一次。

#### Acceptance Criteria

1. WHEN 系统接收支付成功 Callback，系统 SHALL 验证 Transaction ID、Amount、Currency、Receiver、Order ID、Timestamp 与 Signature。
2. WHEN 验证通过，系统 SHALL 将对应订单 Payment Status 置为 SUCCESS。
3. WHEN 验证失败，系统 SHALL 将对应订单 Payment Status 置为 FAILED 或 ERROR，并记录异常。
4. 系统 SHALL 保证同一 Transaction ID 只处理一次，交易入库前 SHALL 校验 transaction_id 唯一性。
5. IF 收到重复 Transaction ID 的 Callback，系统 SHALL 拒绝重复入账并记录去重结果。

### 5. Ledger 记账

**User Story:** AS 系统, I want 为每笔支付建立独立账本, so that 各账户资金变动可追溯。

#### Acceptance Criteria

1. WHEN 支付成功回调验证通过，系统 SHALL 记账：Master Account +金额，C 用户应收 +金额（状态为 Pending Settlement / Receivable）。
2. 账本记录 SHALL 包含交易 ID、账户类型、入账类型、金额、币种、变动前后余额与状态。
3. 记账操作 SHALL 在同一数据库事务内完成，任一环节失败则整体回滚。

### 6. Settlement 结算

**User Story:** AS 系统管理员, I want 对待结算款项执行正式结算, so that 客户应收转化为已结算余额。

#### Acceptance Criteria

1. 结算状态 SHALL 依次包含 PAYMENT_PENDING、PAYMENT_SUCCESS、MASTER_RECEIVED、SETTLEMENT_PENDING、SETTLEMENT_PROCESSING、SETTLEMENT_SUCCESS、SETTLEMENT_FAILED。
2. WHEN 结算执行，系统 SHALL 通过正式结算接口将资金从 Master Account 结算至 C 用户对应币种账户。
3. WHEN 结算成功，系统 SHALL 将订单 Settlement Status 置为 SETTLEMENT_SUCCESS 并记录结算凭证。
4. IF 结算失败，系统 SHALL 将结算状态置为 SETTLEMENT_FAILED 并允许重新处理。
5. 系统 SHALL 记录所有结算操作与结果。

### 7. 防重复交易

**User Story:** AS 系统, I want 阻止同一交易重复入账, so that 客户余额不被错误累加。

#### Acceptance Criteria

1. 系统 SHALL 保证数据库 transaction_id 唯一，重复 Callback 不得重复记账。

### 8. 后台 Dashboard

**User Story:** AS 系统管理员, I want 查看系统运营总览, so that 掌握客户与资金状况。

#### Acceptance Criteria

1. 系统 SHALL 展示客户总数、今日新增客户、USD QR 数量、KHR QR 数量。
2. 系统 SHALL 展示今日支付笔数、今日支付金额、待结算金额、已结算金额。
3. 系统 SHALL 展示失败交易数与异常 Callback 数。

### 9. 客户管理

**User Story:** AS 系统管理员, I want 管理客户列表与详情, so that 可查看、冻结、查看二维码与交易。

#### Acceptance Criteria

1. 客户列表 SHALL 展示 Customer ID、客户姓名、KYC、USD Account、KHR Account、QR 状态、账户状态、注册时间。
2. 系统 SHALL 支持对客户执行查看、冻结、解冻、查看 QR、重新生成 QR、查看交易、查看账本、查看结算操作。
3. 客户详情页 SHALL 展示基本信息、Wing Bank 账户、USD/KHR 二维码、交易记录、账本（余额、待结算、已结算）。

### 10. QR 管理

**User Story:** AS 系统管理员, I want 管理全部客户二维码, so that 可监控二维码状态与操作。

#### Acceptance Criteria

1. 系统 SHALL 展示 QR ID、所属客户、客户姓名、币种、Wing 账户、QR 状态、创建时间、更新时间。
2. QR 状态 SHALL 包含 ACTIVE、DISABLED、INVALID、EXPIRED。

### 11. 安全

**User Story:** AS 系统管理员, I want 系统具备完整安全能力, so that 数据与交易受保护。

#### Acceptance Criteria

1. 系统 SHALL 支持 HTTPS、Admin Login、Role Permission、API Authentication、API Access Control。
2. 系统 SHALL 对 Webhook 执行 Signature Verification。
3. 系统 SHALL 对 Transaction ID 执行 Idempotency 校验。
4. 系统 SHALL 使用 Database Transaction 保证一致性。
5. 系统 SHALL 记录 Audit Log 并实施 Rate Limit。
6. 系统 SHALL 提供 Error Log、Monitoring 与 Database Backup。

## Out of Scope (V1.0 不开发)

- Wing 客户注册功能本身（由 Wing 后台完成）。
- Universal QR（单一二维码同时处理 USD/KHR），待正式接口支持后再开发。

## 已确认决策 (V1.0)

1. **Wing 同步方式**：定义 Wing Sync Adapter 接口，V1.0 使用 mock 数据源实现同步流程，待 Wing API 文档提供后再对接真实接口。
2. **支付/结算 Provider**：PAYMENT_PROVIDER / SETTLEMENT_PROVIDER 保持 mock，模拟正式支付与回调流程验证完整链路。
3. **结算目的地**：通过 Wing 正式结算接口将资金从 Master Account 结算至 C 用户对应币种的 Wing 账户（`wing_usd_account` / `wing_khr_account`）。
