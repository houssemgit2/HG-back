import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class setDefaultValueAvtive1602493444739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'store_promo_mea',
      'active',
      new TableColumn({
        name: 'active',
        default: 1,
        type: 'tinyint',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'store_promo_mea',
      'active',
      new TableColumn({
        name: 'active',
        default: 1,
        type: 'tinyint',
        isNullable: false,
      }),
    );
  }
}
