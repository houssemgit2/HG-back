import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addCulumnsToStore1607334714220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumns(
            'store',
            [new TableColumn({
              name: 'address',
              type: 'varchar'
            }),
            new TableColumn({
                name: 'vit',
                type: 'int',
              }),
              new TableColumn({
                name: 'rcs',
                type: 'varchar',
              }),
              new TableColumn({
                name: 'siret',
                type: 'int',
              }),
              new TableColumn({
                name: 'bank_home',
                type: 'varchar',
              }),
              new TableColumn({
                name: 'bank_iban',
                type: 'varchar',
              })]
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('store',[new TableColumn({
            name: 'address',
            type: 'varchar'
          }),
          new TableColumn({
              name: 'vit',
              type: 'int',
            }),
            new TableColumn({
              name: 'rcs',
              type: 'varchar',
            }),
            new TableColumn({
              name: 'siret',
              type: 'int',
            }),
            new TableColumn({
              name: 'bank_home',
              type: 'varchar',
            }),
            new TableColumn({
              name: 'bank_iban',
              type: 'varchar',
            })]);

    }

}
