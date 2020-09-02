import { query } from 'express';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PromoConcernedTypeIdColumn1599051710010
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      '    ALTER TABLE `promo` CHANGE `status` `status_id` int(2) NOT NULL;',
    );
    await queryRunner.addColumn(
      'promo',
      new TableColumn({
        name: 'promo_concern_type_id',
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'promo',
      new TableColumn({
        name: 'comment',
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('promo', 'promo_concern_type_id');
    await queryRunner.dropColumn('promo', 'comment');
    await queryRunner.dropColumn('promo', 'status_id');
  }
}
