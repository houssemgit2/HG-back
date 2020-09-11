import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameTableCOncernType1599813426950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameTable('promo_concerned_type', 'promo_concern_type');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameTable('promo_concern_type', 'promo_concerned_type');
  }
}
