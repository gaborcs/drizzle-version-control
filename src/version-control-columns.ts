import { integer, text } from "drizzle-orm/sqlite-core";
import { branches, commits } from "./version-control-tables";

export const versionControlColumns = {
  rowId: integer("row_id").primaryKey(),
  entityId: text("entity_id").notNull(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  effectiveFrom: integer("effective_from")
    .notNull()
    .references(() => commits.id),
  effectiveUntil: integer("effective_until").references(() => commits.id),
};
