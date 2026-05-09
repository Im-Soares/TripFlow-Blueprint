import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { tripsTable } from "./trips";
import { usersTable } from "./users";

export const expensesTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => tripsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").default("other"),
  status: text("status").default("confirmed"),
  paidByUserId: uuid("paid_by_user_id").references(() => usersTable.id),
  splitType: text("split_type").default("equal"),
  notes: text("notes").default(""),
  expenseDate: text("expense_date").notNull(),
  createdBy: uuid("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const expenseSplitsTable = pgTable("expense_splits", {
  id: uuid("id").primaryKey().defaultRandom(),
  expenseId: uuid("expense_id")
    .notNull()
    .references(() => expensesTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
});

export const insertExpenseSchema = createInsertSchema(expensesTable, {
  title: z.string().min(1).max(300),
  amount: z.number().int().positive(),
  expenseDate: z.string(),
}).omit({ id: true, createdAt: true });

export type Expense = typeof expensesTable.$inferSelect;
export type ExpenseSplit = typeof expenseSplitsTable.$inferSelect;
