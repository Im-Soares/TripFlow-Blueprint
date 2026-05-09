import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const itineraryDaysTable = pgTable("itinerary_days", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  title: text("title").default(""),
  position: integer("position").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const itineraryItemsTable = pgTable("itinerary_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripDayId: uuid("trip_day_id")
    .notNull()
    .references(() => itineraryDaysTable.id, { onDelete: "cascade" }),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  location: text("location").default(""),
  time: text("time").default(""),
  duration: integer("duration"),
  cost: integer("cost").default(0),
  notes: text("notes").default(""),
  externalLink: text("external_link"),
  category: text("category").default("other"),
  isMustDo: boolean("is_must_do").default(false),
  isCompleted: boolean("is_completed").default(false),
  position: integer("position").default(0),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertItineraryItemSchema = createInsertSchema(itineraryItemsTable, {
  title: z.string().min(1).max(300),
}).omit({ id: true, createdAt: true });

export type ItineraryDay = typeof itineraryDaysTable.$inferSelect;
export type ItineraryItem = typeof itineraryItemsTable.$inferSelect;
