import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateActionTable1605107257882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'actions',
        columns: [
          {
            name: 'id',
            type: 'int',
            width: 4,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            width: 4,
            isNullable: false,
          },
          {
            name: 'browser',
            type: 'varchar',
            width: 255,
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
            width: 255,
            isNullable: true,
          },
          {
            name: 'action_type',
            type: 'varchar',
            width: 255,
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('actions');
  }
}
