import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260517120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "xendit_setting" add column if not exists "webhook_url" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "xendit_setting" drop column if exists "webhook_url";`
    )
  }
}
