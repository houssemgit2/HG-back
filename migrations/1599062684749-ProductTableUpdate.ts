import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ProductTableUpdate1599062684749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns('product', [
      new TableColumn({
        name: 'measure_type_id',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_lot',
        type: 'boolean',
        isNullable: true,
      }),

      new TableColumn({
        name: 'quantity_lot',
        type: 'int',
        isNullable: true,
      }),

      new TableColumn({
        name: 'measure_value',
        type: 'float',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumns('product', [
      new TableColumn({
        name: 'measure_type_id',
        type: 'int',
      }),
      new TableColumn({
        name: 'is_lot',
        type: 'boolean',
      }),

      new TableColumn({
        name: 'quantity_lot',
        type: 'int',
      }),

      new TableColumn({
        name: 'measure_value',
        type: 'float',
      }),
    ]);
  }
}
