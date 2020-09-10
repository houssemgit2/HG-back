import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class adProductConecrnTYpeIDColumn1599754450978
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'promo',
      new TableColumn({ name: 'product_concern_type_id', type: 'int' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('promo', 'product_concern_type_id');
  }
}
