import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1774940243829 implements MigrationInterface {
  name = 'InitTable1774940243829'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 先に users テーブルを作成
    await queryRunner.query(`
        CREATE TABLE \`users\`
        (
            \`id\`         int          NOT NULL AUTO_INCREMENT,
            \`name\`       varchar(255) NOT NULL,
            \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB
    `);

    // 2. 次に books テーブルを作成（FOREIGN KEY 制約付き）
    await queryRunner.query(`
        CREATE TABLE \`books\`
        (
            \`id\`           int          NOT NULL AUTO_INCREMENT,
            \`title\`        varchar(255) NOT NULL,
            \`user_id\`      int          NOT NULL,
            \`is_published\` tinyint      NOT NULL DEFAULT 0,
            \`created_at\`   datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`updated_at\`   datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            PRIMARY KEY (\`id\`),
            CONSTRAINT \`FK_books_user_id\`
                FOREIGN KEY (\`user_id\`)
                    REFERENCES \`users\` (\`id\`)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
        ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 削除時は制約があるため、子テーブル(books)から先に消す必要があります
    await queryRunner.query(`DROP TABLE \`books\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}