import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const travelGoalsTable = pgTable("travel_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  goalType: text("goal_type").default("trips"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  targetYear: integer("target_year"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type TravelGoal = typeof travelGoalsTable.$inferSelect;
