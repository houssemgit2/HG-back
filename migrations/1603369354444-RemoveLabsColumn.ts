import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveLabsColumn1603369354444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('promo', 'laboratory_id');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'promo',
      new TableColumn({ name: 'laboratory_id', type: 'int' }),
    );
  }
}
