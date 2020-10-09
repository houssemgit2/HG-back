import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import { query } from 'express';

export class RemoveIdFOrmStorePromoMEa1602233281657
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('store_promo_mea', 'id');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'store_promo_mea',
      new TableColumn({ name: 'id', type: 'int' }),
    );
  }
}
