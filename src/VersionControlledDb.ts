import type Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as versionControlTables from "./version-control-tables";

export class VersionControlledDb {
  #db;

  constructor(sqliteDb: Database.Database) {
    this.#db = drizzle(sqliteDb, { schema: versionControlTables });
  }

  async createBranch(props: { name: string }): Promise<number> {
    const insertedRows = await this.#db
      .insert(versionControlTables.branches)
      .values(props)
      .returning({ id: versionControlTables.branches.id });
    const branch = insertedRows[0];
    if (!branch) {
      throw new Error("Failed to create branch");
    }
    return branch.id;
  }

  async getBranch(id: number) {
    return this.#db.query.branches.findFirst({
      where: eq(versionControlTables.branches.id, id),
    });
  }
}
