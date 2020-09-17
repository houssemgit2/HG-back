import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePrimaryKeyCLusterPromo1600333537947
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner
      .dropColumn('promo_cluster', 'id')
      .then(data =>
        queryRunner.query(
          'ALTER TABLE `hg_promo_beta`.`promo_cluster`  ADD PRIMARY KEY (`promo_id`, `cluster_id`) USING BTREE;',
        ),
      );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `hg_promo_beta`.`promo_cluster` DROP PRIMARY KEY, `promo_cluster` ADD `id` INT(11) NOT NULL FIRST,ADD PRIMARY KEY (`id`) USING BTREE;',
    );
  }
}
