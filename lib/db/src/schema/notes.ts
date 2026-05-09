import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const notesTable = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default(""),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Note = typeof notesTable.$inferSelect;
