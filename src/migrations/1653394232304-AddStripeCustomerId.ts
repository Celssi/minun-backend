import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeCustomerId1653394232304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user ADD COLUMN stripeCustomer varchar(100)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN stripeCustomer`);
  }
}
