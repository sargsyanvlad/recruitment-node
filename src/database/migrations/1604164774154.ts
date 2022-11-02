import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1604164774154 implements MigrationInterface {
  name = '1604164774154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`CREATE TYPE cert_status AS ENUM ('0', '1', '2');`);

    await queryRunner.query(
      `CREATE TABLE "certificate" ("id" SERIAL NOT NULL, "status" cert_status, "ownerId" integer, "deletedAt" TIMESTAMP, CONSTRAINT "PK_cert6a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );

    await queryRunner.query(
      `ALTER TABLE "certificate" ADD CONSTRAINT "FK_cert28e52f758e7bbc53828db92194" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
    await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "certificate"`);
  }
}
