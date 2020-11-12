import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTableIndex1599063529859 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `product` ADD INDEX `product_measure_type_id_fk` (`measure_type_id`);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `product` DROP INDEX `product_measure_type_id_fk`',
    );
  }
}
