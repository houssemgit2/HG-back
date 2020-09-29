import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultCoulumnToNull1601384335918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `store_promo_mea` CHANGE `officine_rejected_reason_id` `officine_rejected_reason_id` INT(11) NULL;")
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `store_promo_mea` CHANGE `officine_rejected_reason_id` `officine_rejected_reason_id` INT(11) NOT NULL;")

    }

}
