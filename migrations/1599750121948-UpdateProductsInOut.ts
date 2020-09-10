import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateProductsInOut1599750121948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('promo', 'products_id_in', 'product_ids');
    await queryRunner.dropColumn('promo', 'products_id_out');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('promo', 'product_ids', 'products_id_in');
    await queryRunner.addColumn(
      'promo',
      new TableColumn({
        name: 'products_id_out',
        type: 'json',
      }),
    );
  }
}
