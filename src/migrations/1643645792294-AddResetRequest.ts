import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableOptions
} from 'typeorm';

export class AddResetRequest1643645792294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const options: TableOptions = {
      name: 'reset_request',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'userId',
          type: 'int',
          isNullable: false
        },
        {
          name: 'code',
          type: 'varchar',
          isNullable: false,
          isUnique: true
        },
        {
          name: 'date',
          type: 'datetime',
          isNullable: false,
          isUnique: true,
          default: 'CURRENT_TIMESTAMP'
        }
      ]
    };

    await queryRunner.createTable(new Table(options), true);

    const foreignKey = new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
      onDelete: 'CASCADE'
    });

    await queryRunner.createForeignKey('reset_request', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reset_request');
  }
}
