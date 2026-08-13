import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitSchema1786623580893 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
