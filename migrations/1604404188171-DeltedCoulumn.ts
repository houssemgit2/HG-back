import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DeltedCoulumn1604404188171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'promo',
      new TableColumn({
        name: 'deleted_at',
        type: 'datetime',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('promo', 'deleted_at');
  }
}
