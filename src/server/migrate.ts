/**
 * Run database migrations and seed data.
 *
 * Usage:
 *   npm run db:migrate    — run all migrations
 *   npm run db:seed       — load seed data
 *   npm run db:reset      — drop everything, re-migrate, re-seed
 */

import { Pool } from "pg";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "../supabase/migrations");
const SEED_FILE = join(__dirname, "../supabase/seed.sql");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

async function runMigrations(pool: Pool) {
  console.log("Running migrations...");
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    console.log(`  → ${file}`);
    await pool.query(sql);
  }
  console.log("Migrations complete.");
}

async function runSeed(pool: Pool) {
  console.log("Loading seed data...");
  const sql = readFileSync(SEED_FILE, "utf-8");
  await pool.query(sql);
  console.log("Seed data loaded.");
}

async function main() {
  const command = process.argv[2] || "migrate";
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    if (command === "migrate") {
      await runMigrations(pool);
    } else if (command === "seed") {
      await runSeed(pool);
    } else if (command === "reset") {
      console.log("Dropping all tables...");
      await pool.query(`
        DROP TABLE IF EXISTS crowdsourced_reports, schedule_bundles, saved_trips,
          seat_availability_cache, pnr_queries, berths, coach_layouts,
          running_status, route_stops, trains, stations CASCADE;
        DROP TYPE IF EXISTS train_type, running_status_enum, status_source_enum,
          coach_type_enum, berth_type_enum CASCADE;
      `);
      await runMigrations(pool);
      await runSeed(pool);
    } else {
      console.error(`Unknown command: ${command}`);
      console.error("Usage: node src/server/migrate.js [migrate|seed|reset]");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
