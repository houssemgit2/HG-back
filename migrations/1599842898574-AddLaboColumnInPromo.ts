import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLaboColumnInPromo1599842898574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'promo',
      new TableColumn({ name: 'laboratory_id', type: 'int' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('promo', 'laboratory_id');
  }
}
