import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileVisibilityEnum = pgEnum("profile_visibility", [
  "public",
  "friends",
  "private",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  bio: text("bio").default(""),
  preferredCurrency: varchar("preferred_currency", { length: 3 }).default("USD"),
  language: varchar("language", { length: 10 }).default("en"),
  timezone: text("timezone").default("UTC"),
  profileVisibility: profileVisibilityEnum("profile_visibility").default("public"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userSettingsTable = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  notificationTripUpdates: boolean("notification_trip_updates").default(true),
  notificationChatMessages: boolean("notification_chat_messages").default(true),
  notificationBookingReminders: boolean("notification_booking_reminders").default(true),
  notificationChecklistReminders: boolean("notification_checklist_reminders").default(true),
  allowTripInvites: boolean("allow_trip_invites").default(true),
  defaultSharedRole: text("default_shared_role").default("viewer"),
  enableLinkSharingByDefault: boolean("enable_link_sharing_by_default").default(false),
  theme: text("theme").default("dark"),
});

export const insertUserSchema = createInsertSchema(usersTable, {
  email: z.email(),
  name: z.string().min(1).max(100),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
}).omit({ id: true, createdAt: true, updatedAt: true, passwordHash: true });

export const selectUserSchema = createSelectSchema(usersTable).omit({ passwordHash: true });

export type User = typeof usersTable.$inferSelect;
export type UserPublic = Omit<User, "passwordHash">;
export type InsertUser = z.infer<typeof insertUserSchema>;
