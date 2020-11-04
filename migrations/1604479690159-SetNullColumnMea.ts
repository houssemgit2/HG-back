import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetNullColumnMea1604479690159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_minimum_details',
      new TableColumn({
        name: 'eligibility_minimum_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_ca_range_details',
      new TableColumn({
        name: 'eligibility_ca_range_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_fixed_details',
      new TableColumn({
        name: 'remuneration_fixed_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_unit_product_details',
      new TableColumn({
        name: 'remuneration_unit_product_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_ca_annual_details',
      new TableColumn({
        name: 'remuneration_ca_annual_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_other_details',
      new TableColumn({
        name: 'remuneration_other_details',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'has_promo_conso_linked',
      new TableColumn({
        name: 'has_promo_conso_linked',
        type: 'tinyint(4)',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'has_promo_achat_linked',
      new TableColumn({
        name: 'has_promo_achat_linked',
        type: 'tinyint(4)',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_minimum_details',
      new TableColumn({
        name: 'eligibility_minimum_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'eligibility_ca_range_details',
      new TableColumn({
        name: 'eligibility_ca_range_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_fixed_details',
      new TableColumn({
        name: 'remuneration_fixed_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_unit_product_details',
      new TableColumn({
        name: 'remuneration_unit_product_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_ca_annual_details',
      new TableColumn({
        name: 'remuneration_ca_annual_details',
        type: 'json',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'remuneration_other_details',
      new TableColumn({
        name: 'remuneration_other_details',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'has_promo_conso_linked',
      new TableColumn({
        name: 'has_promo_conso_linked',
        type: 'tinyint(4)',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.changeColumn(
      'promo_mea',
      'has_promo_achat_linked',
      new TableColumn({
        name: 'has_promo_achat_linked',
        type: 'tinyint(4)',
        isNullable: true,
        default: null,
      }),
    );
  }
}
