import { sql } from "drizzle-orm";
import { text, int, sqliteTable } from "drizzle-orm/sqlite-core";

const table =
  process.env.NODE_ENV === "production" ? "messages_prod" : "messages_dev";

export const messagesTable = sqliteTable(table, {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  link: text(),
  source: text(),
  message: text().notNull(),
  date: text().default(sql`(CURRENT_TIMESTAMP)`),
  approved: int({ mode: "boolean" }).default(false),
  response: text(),
});

export interface Message {
  id: number;
  name: string;
  link?: string;
  source?: string;
  message: string;
  date: string;
  approved: boolean;
  response?: string;
}
