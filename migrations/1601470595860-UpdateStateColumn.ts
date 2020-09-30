import { MigrationInterface, QueryRunner, Column, TableColumn } from 'typeorm';

import { PROMO_STATE } from '../src/config/enum-types';

export class UpdateStateColumn1601470595860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'store_promo_mea',
      'state',
      new TableColumn({
        name: 'state_id',
        type: 'int',
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'store_promo_mea',
      'state_id',
      new TableColumn({
        name: 'state',
        type: 'enum',
        default: PROMO_STATE.TO_JUSTIFY,
        enum: [
          PROMO_STATE.TO_JUSTIFY,
          PROMO_STATE.CONFIRMED,
          PROMO_STATE.NOT_JUSTIFIED,
          PROMO_STATE.OPERATION_REFUSED,
          PROMO_STATE.PENDING,
          PROMO_STATE.REJECTED,
          PROMO_STATE.UNJUSTIFIED,
        ],
      }),
    );
  }
}
