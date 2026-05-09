import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const bookingsTable = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  provider: text("provider").default(""),
  bookingReference: varchar("booking_reference", { length: 100 }).default(""),
  location: text("location").default(""),
  bookingDate: text("booking_date").notNull(),
  checkOut: text("check_out"),
  price: integer("price").default(0),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: text("status").default("confirmed"),
  notes: text("notes").default(""),
  externalLink: text("external_link"),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable, {
  title: z.string().min(1).max(300),
  bookingDate: z.string(),
}).omit({ id: true, createdAt: true });

export type Booking = typeof bookingsTable.$inferSelect;
