import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260517001052 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "xendit_setting" ("id" text not null, "secret_key" text null, "webhook_token" text null, "storefront_url" text null, "invoice_duration_seconds" integer not null default 86400, "is_enabled" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "xendit_setting_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_xendit_setting_deleted_at" ON "xendit_setting" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "xendit_setting" cascade;`);
  }

}
