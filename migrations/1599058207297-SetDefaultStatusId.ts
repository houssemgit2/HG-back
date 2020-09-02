import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultStatusId1599058207297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `promo` CHANGE `status_id` `status_id` INT(2) NOT NULL DEFAULT '0';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `promo` CHANGE `status_id` `status_id` INT(2) NOT NULL;',
    );
  }
}
