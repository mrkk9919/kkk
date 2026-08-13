# BAKONG + Wing 中转结算系统 - 部署说明

## 环境要求

- Node.js >= 22
- PostgreSQL >= 15

## 1. 安装依赖

```bash
cd backend
npm install
```

## 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

| 变量 | 说明 | 示例 |
|------|------|------|
| `DB_*` | PostgreSQL 连接 | host/port/username/password/database |
| `JWT_SECRET` | 管理员 JWT 签名密钥 | 生产环境必须更换为强随机值 |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 管理员登录账号 | 生产环境必须修改 |
| `WEBHOOK_SECRET` | 支付回调 HMAC 签名密钥 | 与金融机构约定，生产必须更换 |
| `PAYMENT_PROVIDER` | 支付 Provider | `mock`（默认）或后续正式 `bakong` |
| `SETTLEMENT_PROVIDER` | 结算 Provider | `mock`（默认）或后续正式 `bakong` |

## 3. 初始化数据库

方式一：直接执行 SQL 脚本

```bash
psql -U postgres -d bakong_dev -f sql/init.sql
```

方式二：使用 TypeORM 迁移

```bash
npm run migration:run
```

## 4. 构建并启动

```bash
npm run build
npm run start:prod
```

服务默认监听 `3000` 端口，API 前缀为 `/api/v1`。

## 5. 验证

```bash
curl http://localhost:3000/api/v1/health
```

## 测试

```bash
# 单元测试
npm test

# 端到端测试（需先初始化 bakong_test 库）
NODE_ENV=test npm run migration:run
NODE_ENV=test npx jest --config ./test/jest-e2e.json
```

## 生产环境注意

- `JWT_SECRET`、`WEBHOOK_SECRET`、`ADMIN_PASSWORD` 必须替换为强随机值
- 必须使用 HTTPS/TLS 对外提供服务
- 接入真实 BAKONG/银行接口时，实现 `BakongPaymentProvider` / `BakongSettlementProvider` 并注册到 `ProviderRegistry`，将 `PAYMENT_PROVIDER` / `SETTLEMENT_PROVIDER` 切换为 `bakong`
- 资金状态（PAYMENT_SUCCESS / SETTLEMENT_SUCCESS）仅接受经签名验证的回调或正式结算接口结果，禁止前端传入
- 配置数据库定期备份与运行监控
