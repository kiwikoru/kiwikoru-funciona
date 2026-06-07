import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const enquiries = mysqlTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 100 }).notNull(),
  projectType: varchar("project_type", { length: 100 }),
  message: text("message").notNull(),
  quoteRef: text("quote_ref"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
