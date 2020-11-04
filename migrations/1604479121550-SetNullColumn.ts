import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetNullColumn1604479121550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_other_details',
      new TableColumn({
        name: 'eligibility_other_details',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_other_details',
      new TableColumn({
        name: 'eligibility_other_details',
        type: 'text',
        isNullable: true,
      }),
    );
  }
}
