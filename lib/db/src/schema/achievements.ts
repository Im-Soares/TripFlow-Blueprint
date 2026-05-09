import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const achievementsTable = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").default("trips"),
  requirementType: text("requirement_type").notNull(),
  requirementValue: integer("requirement_value").notNull(),
});

export const userAchievementsTable = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id")
    .notNull()
    .references(() => achievementsTable.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).defaultNow().notNull(),
  progressValue: integer("progress_value").default(0),
});

export type Achievement = typeof achievementsTable.$inferSelect;
export type UserAchievement = typeof userAchievementsTable.$inferSelect;
