import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DeleteColumnStorePromoMea1604492132162
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'store_promo_mea',
      new TableColumn({
        name: 'deleted_at',
        type: 'datetime',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('store_promo_mea', 'deleted_at');
  }
}
