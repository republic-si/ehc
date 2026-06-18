import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "../db/client.ts";

async function main() {
  const schemaPath = join(process.cwd(), "db", "schema.sql");
  const raw = readFileSync(schemaPath, "utf8");
  const statements = raw
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    process.stdout.write(`exec: ${stmt.split("\n")[0].slice(0, 80)}…\n`);
    await sql.query(stmt + ";");
  }

  const [{ count: releasesCount }] = await sql`
    SELECT count(*)::int AS count FROM releases
  ` as Array<{ count: number }>;
  const [{ count: pickupsCount }] = await sql`
    SELECT count(*)::int AS count FROM pickups
  ` as Array<{ count: number }>;

  console.log(
    `migrate done. releases=${releasesCount} pickups=${pickupsCount}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
