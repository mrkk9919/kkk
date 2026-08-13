"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMasterAccountPhone1786625626000 = void 0;
class AddMasterAccountPhone1786625626000 {
    name = 'AddMasterAccountPhone1786625626000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "master_accounts" ADD "phone" character varying(32)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "master_accounts" DROP COLUMN "phone"`);
    }
}
exports.AddMasterAccountPhone1786625626000 = AddMasterAccountPhone1786625626000;
//# sourceMappingURL=1786625626000-AddMasterAccountPhone.js.map