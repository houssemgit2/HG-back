import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetDefaultCoqueFileStatus1602147470446
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'coque_promo_files',
      'status',
      new TableColumn({ name: 'status', type: 'tinyint', default: 0 }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'coque_promo_files',
      'status',
      new TableColumn({ name: 'status', type: 'tinyint' }),
    );
  }
}
