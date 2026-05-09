import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const chatMessagesTable = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  senderUserId: uuid("sender_user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
