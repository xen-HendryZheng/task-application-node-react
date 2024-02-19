import { MigrationInterface, QueryRunner } from "typeorm";

export class init1708350695627 implements MigrationInterface {
    name = 'init1708350695627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_task_status_enum" AS ENUM('not_urgent', 'due_soon', 'overdue')`);
        await queryRunner.query(`CREATE TABLE "task" ("task_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "task_name" text NOT NULL, "task_description" text NOT NULL, "task_status" "public"."task_task_status_enum" NOT NULL, "task_due_date" TIMESTAMP WITH TIME ZONE, "task_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_721f914bb100703f201a77dd58f" PRIMARY KEY ("task_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "user_email" text NOT NULL, "user_password" text NOT NULL, "user_last_login" TIMESTAMP WITH TIME ZONE, "user_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65d72a4b8a5fcdad6edee8563b" ON "user" ("user_email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_65d72a4b8a5fcdad6edee8563b"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_task_status_enum"`);
    }

}
