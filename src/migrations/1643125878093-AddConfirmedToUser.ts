import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConfirmedToUser1643125878093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user ADD COLUMN confirmed BOOLEAN DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN confirmed`);
  }
}
