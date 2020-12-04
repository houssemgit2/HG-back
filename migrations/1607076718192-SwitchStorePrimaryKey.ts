import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SwitchStorePrimaryKey1607076718192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'store',
      new TableColumn({
        name: 'cip',
        type: 'int',
        width: 11,
      }),
    );
    await queryRunner.query('UPDATE store SET cip=id WHERE 1');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('store', 'cip');
  }
}
