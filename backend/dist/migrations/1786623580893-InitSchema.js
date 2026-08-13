"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1786623580893 = void 0;
class InitSchema1786623580893 {
    name = 'InitSchema1786623580893';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "admin_id" uuid, "action" character varying NOT NULL, "target_type" character varying NOT NULL, "target_id" character varying, "ip" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "callbacks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying NOT NULL, "callback_type" character varying NOT NULL, "payload" jsonb NOT NULL, "signature" text NOT NULL, "status" character varying NOT NULL, "received_at" TIMESTAMP WITH TIME ZONE NOT NULL, "processed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_6a3837029cf58553356fb623970" UNIQUE ("transaction_id"), CONSTRAINT "PK_8090fb14d5629af03bc043429d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exception_queue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "order_id" uuid, "transaction_id" character varying, "detail" jsonb, "status" character varying NOT NULL DEFAULT 'OPEN', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "resolved_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_291c2820263d7e5a244630ba6c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ledger_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying NOT NULL, "user_id" uuid, "account_type" character varying NOT NULL, "entry_type" character varying NOT NULL, "amount" numeric(18,2) NOT NULL, "balance_before" numeric(18,2) NOT NULL, "balance_after" numeric(18,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING_SETTLEMENT', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6efcb84411d3f08b08450ae75d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f1d537dd6c4046137dd63d6eed" ON "ledger_entries"  ("transaction_id", "account_type", "entry_type") `);
        await queryRunner.query(`CREATE TABLE "master_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_identifier" character varying NOT NULL, "qr_payload" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_295f1b8eefd178cbef38ad7ae45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wing_account" character varying NOT NULL, "real_name" character varying NOT NULL, "phone" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c573b4f1515cdf571d7de6a5b6d" UNIQUE ("wing_account"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "qr_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "qr_type" character varying NOT NULL, "qr_payload" text NOT NULL, "qr_image" text, "status" character varying NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4b7aa338e150a878ce9e2c55c5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_no" character varying NOT NULL, "payer_user_id" uuid NOT NULL, "receiver_user_id" uuid NOT NULL, "qr_id" uuid NOT NULL, "amount" numeric(18,2) NOT NULL, "currency" character varying(3) NOT NULL, "master_account_id" uuid NOT NULL, "transaction_id" character varying, "payment_status" character varying NOT NULL, "settlement_status" character varying NOT NULL DEFAULT 'NONE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "paid_at" TIMESTAMP WITH TIME ZONE, "settled_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_c01772865d67627592ca58f864a" UNIQUE ("order_no"), CONSTRAINT "UQ_8d666c0432f809dc7875ce99139" UNIQUE ("transaction_id"), CONSTRAINT "PK_158dd178010c39759305293a149" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settlement_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "user_id" uuid NOT NULL, "amount" numeric(18,2) NOT NULL, "destination" character varying NOT NULL, "status" character varying NOT NULL, "provider_transaction_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_233258ed7288e05795b6873f0e6" UNIQUE ("order_id"), CONSTRAINT "PK_d40363cbdc3c2c03c4a2f1e1d83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "qr_codes" ADD CONSTRAINT "FK_f1f441f26cb73a38ee7026ab35c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_orders" ADD CONSTRAINT "FK_1fbefcd90df2857988931a9872d" FOREIGN KEY ("payer_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_orders" ADD CONSTRAINT "FK_f66e24b1ef98eae9055fc9cc07c" FOREIGN KEY ("receiver_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_orders" ADD CONSTRAINT "FK_49360e97422fd05d87595c3d3e8" FOREIGN KEY ("qr_id") REFERENCES "qr_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_orders" ADD CONSTRAINT "FK_67dbfb88c051bcda813110e3c72" FOREIGN KEY ("master_account_id") REFERENCES "master_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settlement_records" ADD CONSTRAINT "FK_233258ed7288e05795b6873f0e6" FOREIGN KEY ("order_id") REFERENCES "payment_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settlement_records" ADD CONSTRAINT "FK_72f6153b28eea84cf41951aa0f5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "settlement_records" DROP CONSTRAINT "FK_72f6153b28eea84cf41951aa0f5"`);
        await queryRunner.query(`ALTER TABLE "settlement_records" DROP CONSTRAINT "FK_233258ed7288e05795b6873f0e6"`);
        await queryRunner.query(`ALTER TABLE "payment_orders" DROP CONSTRAINT "FK_67dbfb88c051bcda813110e3c72"`);
        await queryRunner.query(`ALTER TABLE "payment_orders" DROP CONSTRAINT "FK_49360e97422fd05d87595c3d3e8"`);
        await queryRunner.query(`ALTER TABLE "payment_orders" DROP CONSTRAINT "FK_f66e24b1ef98eae9055fc9cc07c"`);
        await queryRunner.query(`ALTER TABLE "payment_orders" DROP CONSTRAINT "FK_1fbefcd90df2857988931a9872d"`);
        await queryRunner.query(`ALTER TABLE "qr_codes" DROP CONSTRAINT "FK_f1f441f26cb73a38ee7026ab35c"`);
        await queryRunner.query(`DROP TABLE "settlement_records"`);
        await queryRunner.query(`DROP TABLE "payment_orders"`);
        await queryRunner.query(`DROP TABLE "qr_codes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "master_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1d537dd6c4046137dd63d6eed"`);
        await queryRunner.query(`DROP TABLE "ledger_entries"`);
        await queryRunner.query(`DROP TABLE "exception_queue"`);
        await queryRunner.query(`DROP TABLE "callbacks"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }
}
exports.InitSchema1786623580893 = InitSchema1786623580893;
//# sourceMappingURL=1786623580893-InitSchema.js.map