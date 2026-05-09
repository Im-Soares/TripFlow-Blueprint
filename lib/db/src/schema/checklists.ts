import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const checklistsTable = pgTable("checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const checklistItemsTable = pgTable("checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  checklistId: uuid("checklist_id")
    .notNull()
    .references(() => checklistsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").default("other"),
  isCompleted: boolean("is_completed").default(false),
  assignedToUserId: uuid("assigned_to_user_id").references(() => usersTable.id),
  position: integer("position").default(0),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItemsTable, {
  title: z.string().min(1).max(300),
}).omit({ id: true });

export type Checklist = typeof checklistsTable.$inferSelect;
export type ChecklistItem = typeof checklistItemsTable.$inferSelect;
