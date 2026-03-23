import { sql } from "drizzle-orm";
import { text, int, sqliteTable } from "drizzle-orm/sqlite-core";

export const messagesTable = sqliteTable("messages", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  link: text(),
  source: text(),
  message: text().notNull(),
  date: text().default(sql`(CURRENT_DATE)`),
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
