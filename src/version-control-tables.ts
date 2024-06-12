import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
});

export const branches = sqliteTable("branches", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const commits = sqliteTable("commits", {
  id: integer("id").primaryKey({
    // A row of a versioned table is effective at a given commit if the branch matches and the row's effective_from <= commit_id < effective_until.
    // Therefore, the commit id column must be an auto-incrementing primary key.
    autoIncrement: true,
  }),
  branchId: integer("branch_id")
    .notNull()
    .references(() => branches.id),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
});
