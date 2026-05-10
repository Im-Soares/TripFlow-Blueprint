import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/tripflow";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";
