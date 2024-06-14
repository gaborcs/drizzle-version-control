import { exec as execWithCallback } from "node:child_process";
import { rm } from "node:fs/promises";
import { promisify } from "node:util";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { beforeAll, expect, test } from "vitest";
import { VersionControlledDb } from "../src/VersionControlledDb";
import * as exampleSchema from "./example-schema";

const exec = promisify(execWithCallback);

let serializedSchema: Buffer;

beforeAll(async () => {
  await exec(
    "drizzle-kit push --dialect=sqlite --schema=test/example-schema.ts --url=file:./test/example-schema.db",
  );
  const db = new Database("./test/example-schema.db");
  serializedSchema = db.serialize();
  db.close();

  return async function cleanup() {
    await rm("./test/example-schema.db");
  };
});

test("schema can be created", async () => {
  const db = drizzle(new Database(serializedSchema), { schema: exampleSchema });
  expect(db).toBeDefined();
});

test("a branch can be created from scratch", async () => {
  const db = new VersionControlledDb(new Database(serializedSchema));
  const branchId = await db.createBranch({ name: "main" });
  const branch = await db.getBranch(branchId);
  if (!branch) {
    throw new Error("Branch not found");
  }
  expect(branch.name).toBe("main");
});

test("creating a branch with invalid data throws an error", async () => {
  const db = new VersionControlledDb(new Database(serializedSchema));
  await expect(db.createBranch({ name: "" })).rejects.toThrow(
    "Branch name is required",
  );
});
