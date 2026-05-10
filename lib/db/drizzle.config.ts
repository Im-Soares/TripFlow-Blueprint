import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import path from "path";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/tripflow";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
