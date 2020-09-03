import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DropRemunerationTable1599151319910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('remuneration');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'remuneration',
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
            name: 'price',
            type: 'int',
          },
          {
            name: 'remuneration_type_id',
            type: 'int',
          },
          {
            name: 'emplacement_type_id',
            type: 'int',
          },
          {
            name: 'unity_max',
            type: 'float',
            precision: 12,
          },
          {
            name: 'unity_min',
            type: 'float',
            precision: 12,
          },
        ],
      }),
    );
  }
}
