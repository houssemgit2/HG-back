import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetDefaultCoqueStatus1602146992361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'coque_promo',
      'status',
      new TableColumn({ name: 'status', type: 'tinyint', default: 0 }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'coque_promo',
      'status',
      new TableColumn({ name: 'status', type: 'tinyint' }),
    );
  }
}
