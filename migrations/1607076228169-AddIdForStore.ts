import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIdForStore1607076228169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('store', 'cip', 'id');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('store', 'id', 'cip');
  }
}
