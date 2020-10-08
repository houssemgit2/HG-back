
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

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
        default: 'TO_JUSTIFY',
        enum: [
          'TO_JUSTIFY',
          'CONFIRMED',
          'NOT_JUSTIFIED',
          'OPERATION_REFUSED',
          'PENDING',
          'REJECTED',
          'UNJUSTIFIED',
        ],
      }),
    );
  }
}
