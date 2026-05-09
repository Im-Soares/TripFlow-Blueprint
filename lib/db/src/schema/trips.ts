import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { usersTable } from "./users";

export const tripStatusEnum = pgEnum("trip_status", [
  "planning",
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const tripMemberRoleEnum = pgEnum("trip_member_role", [
  "owner",
  "editor",
  "viewer",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
  "revoked",
]);

export const tripsTable = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  country: text("country").default(""),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  travelersCount: integer("travelers_count").default(1),
  travelType: text("travel_type").default("leisure"),
  estimatedBudget: integer("estimated_budget").default(0),
  currency: varchar("currency", { length: 3 }).default("USD"),
  coverImageUrl: text("cover_image_url"),
  accentColor: varchar("accent_color", { length: 20 }).default("#7C6FF7"),
  status: tripStatusEnum("status").default("planning"),
  notes: text("notes").default(""),
  shareToken: varchar("share_token", { length: 64 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tripMembersTable = pgTable("trip_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  role: tripMemberRoleEnum("role").default("viewer").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  invitedBy: uuid("invited_by").references(() => usersTable.id),
  invitationStatus: invitationStatusEnum("invitation_status").default("accepted"),
});

export const tripInvitationsTable = pgTable("trip_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  invitedByUserId: uuid("invited_by_user_id")
    .notNull()
    .references(() => usersTable.id),
  invitedEmail: text("invited_email").notNull(),
  inviteToken: varchar("invite_token", { length: 128 }).notNull().unique(),
  role: tripMemberRoleEnum("role").default("viewer").notNull(),
  passwordProtected: boolean("password_protected").default(false),
  accessPasswordHash: text("access_password_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  status: invitationStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tripShareLinksTable = pgTable("trip_share_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => usersTable.id),
  shareToken: varchar("share_token", { length: 128 }).notNull().unique(),
  role: tripMemberRoleEnum("role").default("viewer").notNull(),
  isActive: boolean("is_active").default(true),
  requiresPassword: boolean("requires_password").default(false),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const insertTripSchema = createInsertSchema(tripsTable, {
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  startDate: z.string(),
  endDate: z.string(),
}).omit({ id: true, ownerId: true, shareToken: true, createdAt: true, updatedAt: true });

export type Trip = typeof tripsTable.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type TripMember = typeof tripMembersTable.$inferSelect;
