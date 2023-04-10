import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRequiredFromDescription1645167959227
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE work_history MODIFY description varchar(1000) null;`
    );
    await queryRunner.query(
      `ALTER TABLE education MODIFY description varchar(1000) null;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE work_history MODIFY description varchar(1000) not null;`
    );
    await queryRunner.query(
      `ALTER TABLE education MODIFY description varchar(1000) not null;`
    );
  }
}
