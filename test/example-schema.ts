import { sqliteTable } from "drizzle-orm/sqlite-core";
import { versionControlColumns } from "../src/version-control-columns";

export * from "../src/version-control-tables";

export const versionedTable = sqliteTable("versioned_table", {
  ...versionControlColumns,
});
