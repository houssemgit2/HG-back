import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DropEligibilityTable1599153528164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('eligibility_condition');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'eligibility_condition',
        columns: [
          {
            name: 'id',
            type: 'int4',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'promo_id',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'has_condition',
            type: 'tinyint',
            width: 1,
          },
          {
            name: 'is_variegated',
            type: 'tinyint',
            width: 1,
          },
          {
            name: 'price_min',
            type: 'float',
            precision: 12,
          },
          {
            name: 'price_max',
            type: 'float',
            precision: 12,
          },
        ],
      }),
    );
  }
}
