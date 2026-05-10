import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { usersTable } from "./users";

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const postCommentsTable = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const postLikesTable = pgTable("post_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userFollowsTable = pgTable("user_follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  followingId: uuid("following_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Post = typeof postsTable.$inferSelect;
export type PostComment = typeof postCommentsTable.$inferSelect;
export type PostLike = typeof postLikesTable.$inferSelect;
export type UserFollow = typeof userFollowsTable.$inferSelect;

export type CreatePostInput = {
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
};

export const createPostSchema = createInsertSchema(postsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createPostCommentSchema = createInsertSchema(postCommentsTable).omit({
  id: true,
  createdAt: true,
});

export const createPostLikeSchema = createInsertSchema(postLikesTable).omit({
  id: true,
  createdAt: true,
});

export const createUserFollowSchema = createInsertSchema(userFollowsTable).omit({
  id: true,
  createdAt: true,
});