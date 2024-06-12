import { exec as execWithCallback } from "node:child_process";
import { rm } from "node:fs/promises";
import { promisify } from "node:util";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { beforeAll, expect, test } from "vitest";
import * as schema from "./example-schema";

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
  const db = drizzle(new Database(serializedSchema), { schema });
  expect(db).toBeDefined();
});
