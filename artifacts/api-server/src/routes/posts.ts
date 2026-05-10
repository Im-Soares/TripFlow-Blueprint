import { and, eq, desc, sql } from "drizzle-orm";
import { Router } from "express";
import { db, postsTable, postCommentsTable, postLikesTable, userFollowsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/* ─── List posts (feed) ─── */
router.get("/posts", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { limit = "20", offset = "0" } = req.query as { limit?: string; offset?: string };

    // Get posts from users that the current user follows, plus their own posts
    const following = await db
      .select({ followingId: userFollowsTable.followingId })
      .from(userFollowsTable)
      .where(eq(userFollowsTable.followerId, userId));

    const followingIds = following.map(f => f.followingId);

    const posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        location: postsTable.location,
        description: postsTable.description,
        imageUrl: postsTable.imageUrl,
        createdAt: postsTable.createdAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .where(
        followingIds.length > 0
          ? sql`${postsTable.authorId} IN (${followingIds}) OR ${postsTable.authorId} = ${userId}`
          : eq(postsTable.authorId, userId)
      )
      .orderBy(desc(postsTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Get comment and like counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postCommentsTable)
          .where(eq(postCommentsTable.postId, post.id));

        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postLikesTable)
          .where(eq(postLikesTable.postId, post.id));

        const [userLiked] = await db
          .select()
          .from(postLikesTable)
          .where(and(
            eq(postLikesTable.postId, post.id),
            eq(postLikesTable.userId, userId)
          ));

        return {
          ...post,
          commentCount: commentCount.count,
          likeCount: likeCount.count,
          userLiked: !!userLiked,
        };
      })
    );

    res.json({ posts: postsWithCounts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/* ─── Get user's posts ─── */
router.get("/posts/user/:userId", requireAuth, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params as { userId: string };
    const currentUserId = req.user!.userId;
    const { limit = "20", offset = "0" } = req.query as { limit?: string; offset?: string };

    const posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        location: postsTable.location,
        description: postsTable.description,
        imageUrl: postsTable.imageUrl,
        createdAt: postsTable.createdAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .where(eq(postsTable.authorId, targetUserId))
      .orderBy(desc(postsTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Get counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postCommentsTable)
          .where(eq(postCommentsTable.postId, post.id));

        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postLikesTable)
          .where(eq(postLikesTable.postId, post.id));

        const [userLiked] = await db
          .select()
          .from(postLikesTable)
          .where(and(
            eq(postLikesTable.postId, post.id),
            eq(postLikesTable.userId, currentUserId)
          ));

        return {
          ...post,
          commentCount: commentCount.count,
          likeCount: likeCount.count,
          userLiked: !!userLiked,
        };
      })
    );

    res.json({ posts: postsWithCounts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

/* ─── Create post ─── */
router.post("/posts", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { title, location, description, imageUrl } = req.body as { title: string; location: string; description: string; imageUrl?: string };

    if (!title || !location || !description) {
      res.status(400).json({ error: "title, location, and description are required" });
      return undefined;
    }

    const [post] = await db
      .insert(postsTable)
      .values({
        authorId: userId,
        title: String(title),
        location: String(location),
        description: String(description),
        imageUrl: imageUrl ? String(imageUrl) : null,
      })
      .returning();

    req.log.info({ postId: post.id, userId }, "Post created");
    res.json({ post });
    return undefined;
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
    return undefined;
  }
});

/* ─── Get single post ─── */
router.get("/posts/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const [post] = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        location: postsTable.location,
        description: postsTable.description,
        imageUrl: postsTable.imageUrl,
        createdAt: postsTable.createdAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
      .where(eq(postsTable.id, id));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get comments
    const comments = await db
      .select({
        id: postCommentsTable.id,
        text: postCommentsTable.text,
        createdAt: postCommentsTable.createdAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(postCommentsTable)
      .innerJoin(usersTable, eq(postCommentsTable.authorId, usersTable.id))
      .where(eq(postCommentsTable.postId, id))
      .orderBy(postCommentsTable.createdAt);

    // Get like count and user's like status
    const [likeCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postLikesTable)
      .where(eq(postLikesTable.postId, id));

    const [userLiked] = await db
      .select()
      .from(postLikesTable)
      .where(and(
        eq(postLikesTable.postId, id),
        eq(postLikesTable.userId, userId)
      ));

    res.json({
      post: {
        ...post,
        commentCount: comments.length,
        likeCount: likeCount.count,
        userLiked: !!userLiked,
        comments,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
    return;
  }
});

/* ─── Like/Unlike post ─── */
router.post("/posts/:id/like", requireAuth, async (req, res): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const existingLike = await db
      .select()
      .from(postLikesTable)
      .where(and(
        eq(postLikesTable.postId, id),
        eq(postLikesTable.userId, userId)
      ));

    if (existingLike.length > 0) {
      // Unlike
      await db
        .delete(postLikesTable)
        .where(and(
          eq(postLikesTable.postId, id),
          eq(postLikesTable.userId, userId)
        ));
      res.json({ liked: false });
      return undefined;
    } else {
      // Like
      await db.insert(postLikesTable).values({
        postId: id,
        userId,
      });
      res.json({ liked: true });
      return undefined;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
    return undefined;
  }
});

/* ─── Add comment ─── */
router.post("/posts/:id/comments", requireAuth, async (req, res): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const { text } = req.body as { text: string };

    if (!text) {
      res.status(400).json({ error: "Comment text is required" });
      return undefined;
    }

    const [comment] = await db
      .insert(postCommentsTable)
      .values({
        postId: id,
        authorId: userId,
        text: String(text),
      })
      .returning();

    const commentWithAuthor = await db
      .select({
        id: postCommentsTable.id,
        text: postCommentsTable.text,
        createdAt: postCommentsTable.createdAt,
        author: {
          id: usersTable.id,
          name: usersTable.name,
          username: usersTable.username,
          avatarUrl: usersTable.avatarUrl,
        },
      })
      .from(postCommentsTable)
      .innerJoin(usersTable, eq(postCommentsTable.authorId, usersTable.id))
      .where(eq(postCommentsTable.id, comment.id))
      .limit(1);

    res.json({ comment: commentWithAuthor[0] });
    return undefined;
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
    return undefined;
  }
});

/* ─── Follow/Unfollow user ─── */
router.post("/users/:id/follow", requireAuth, async (req, res) => {
  try {
    const { id: targetUserId } = req.params as { id: string };
    const followerId = req.user!.userId;

    if (targetUserId === followerId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const existingFollow = await db
      .select()
      .from(userFollowsTable)
      .where(and(
        eq(userFollowsTable.followerId, followerId),
        eq(userFollowsTable.followingId, targetUserId)
      ));

    if (existingFollow.length > 0) {
      // Unfollow
      await db
        .delete(userFollowsTable)
        .where(and(
          eq(userFollowsTable.followerId, followerId),
          eq(userFollowsTable.followingId, targetUserId)
        ));
      res.json({ following: false });
    } else {
      // Follow
      await db.insert(userFollowsTable).values({
        followerId,
        followingId: targetUserId,
      });
      res.json({ following: true });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ error: "Failed to toggle follow" });
    return;
  }
});

/* ─── Get user stats ─── */
router.get("/users/:id/stats", requireAuth, async (req, res) => {
  try {
    const { id: targetUserId } = req.params as { id: string };
    const currentUserId = req.user!.userId;

    // Get follower count
    const [followerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userFollowsTable)
      .where(eq(userFollowsTable.followingId, targetUserId));

    // Get following count
    const [followingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userFollowsTable)
      .where(eq(userFollowsTable.followerId, targetUserId));

    // Get post count
    const [postCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postsTable)
      .where(eq(postsTable.authorId, targetUserId));

    // Check if current user follows this user
    const [isFollowing] = await db
      .select()
      .from(userFollowsTable)
      .where(and(
        eq(userFollowsTable.followerId, currentUserId),
        eq(userFollowsTable.followingId, targetUserId)
      ));

    res.json({
      followers: followerCount.count,
      following: followingCount.count,
      posts: postCount.count,
      isFollowing: !!isFollowing,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
    return;
  }
});

export default router;