# User Instruction Memory

This file records user instructions, preferences, and teachings for reference in future interactions.

## Format

### User Instruction Entry
User instruction entries should follow this format:

[User Instruction Summary]
- Date: [YYYY-MM-DD]
- Context: [Mentioned scenario or time]
- Instructions:
  - [Content of user teaching or instruction, described line by line]

### Project Knowledge Entry
Entries discovered by the Agent during task execution should follow this format:

[Project Knowledge Summary]
- Date: [YYYY-MM-DD]
- Context: Discovered by Agent while performing [specific task description]
- Category: [Operations & Deployment|Build Methods|Testing Methods|Troubleshooting & Debugging|Workflow & Collaboration|Environment Configuration]
- Instructions:
  - [Specific knowledge points, described line by line]

## Deduplication Strategy
- Before adding a new entry, check for similar or identical instructions.
- If a duplicate is found, skip the new entry or merge it with the existing one.
- When merging, update the context or date information.
- This helps avoid redundant entries and keeps the memory file tidy.

## Entries

[Project Knowledge Summary]
- Date: 2026-08-13
- Context: 用户提供真实 BAKONG 主账号（KHQR 静态收款码），绑定为系统 Master Account
- Category: Operations & Deployment
- Instructions:
  - 生产 Master Account（主 BAKONG 收款号）：`wang99199@bkrt`，手机 `+855 31 838 8000`，收款人 `YUKHEANG SOEU`，城市 Phnom Penh
  - 真实 KHQR Payload 已绑定：`00020101021115311974011600520446BONG1000231208129180014wang99199@bkrt5204599953031165802KH5913YUKHEANG SOEU6010Phnom Penh6304A245`（CRC A245 已验证通过）
  - Master Account 实体含 `phone` 字段；create 接口支持传入 `qrPayload`（真实静态 QR）与 `phone`，否则自动生成
  - 演示用 `wing-master-001` 已置为 INACTIVE，当前 ACTIVE master 为真实 BAKONG 号

[Project Knowledge Summary]
- Date: 2026-08-13
- Context: 用户反馈 BAKONG App 扫码报 "Invalid QR Merchant data"，排查后修复了 KHQR 生成结构
- Category: Troubleshooting & Debugging
- Instructions:
  - BAKONG 个人收款码必须用 Tag 29（内部 `00`=bakongAccountId，如 `wang99199@bkrt`），不能使用通用 EMV 的 Tag 26 + "BAKONG" GUID 结构（那会导致 BAKONG App 报 Invalid QR Merchant data）
  - 正确 KHQR 结构：`00:01 + 01:11(静态) + 29:{00:bakongAccountId} + 52:5999 + 53:116(KHR)/840(USD) + 58:KH + 59:商户名(客户真实姓名) + 60:Phnom Penh + 63:CRC`；个人用 Tag 29，商户用 Tag 30
  - 生成结果必须用官方 SDK 交叉验证（`konthaina-khqr` npm 包，`new KHQRGenerator('individual')...generate()` + `KHQRGenerator.verify()`）
  - QR 生成的商户名应使用客户真实姓名（如 SNLGBINSIIS），并传 `merchantName` 参数；QR 图片用 errorCorrectionLevel 'H' 以支持中心 logo

[Project Knowledge Summary]
- Date: 2026-08-13
- Context: 用户反馈无法登录，排查发现后端未启动，补齐运行环境后启动成功
- Category: Operations & Deployment
- Instructions:
  - 后端 `/workspace/backend` 只有编译产物 `dist`，无 `src` 源码、无 `package.json`、无 `node_modules`；需手动创建 `package.json`（NestJS 11 + TypeORM 0.3 + pg）并 `npm install`
  - 后端依赖 PostgreSQL：`apt-get install -y postgresql` 后 `service postgresql start`，建库 `createdb bakong_dev`，postgres 密码为 `postgres`
  - 运行前需创建 `.env`（参考 `.env.example`）；`dist/config/data-source.js` 中 entities/migrations glob 为 `.ts` 后缀，必须改为 `.js` 才能加载
  - 建表：`cd backend && npx typeorm migration:run -d dist/config/data-source.js`（`uuid_generate_v4` 依赖 Postgres 内置，无需插件）
  - 启动后端：`cd backend && node dist/main.js`（端口 3000，全局前缀 `api/v1`）；前端 vite 代理 `/api` → `localhost:3000`
  - 管理登录：`admin` / `admin123`（来自 `.env` 的 `ADMIN_USERNAME`/`ADMIN_PASSWORD`）
