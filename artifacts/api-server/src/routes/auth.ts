import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Router } from "express";
import { db, usersTable, userSettingsTable } from "@workspace/db";
import { signToken } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/* ─── Register ─── */
router.post("/auth/register", async (req, res) => {
  const { name, email, password, username } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedUsername = (username ?? email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_")).slice(0, 50);

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, trimmedEmail))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: name.trim(),
        email: trimmedEmail,
        username: trimmedUsername,
        passwordHash,
        preferredCurrency: "USD",
      })
      .returning();

    await db.insert(userSettingsTable).values({ userId: user.id });

    const token = signToken({ userId: user.id, email: user.email });

    const { passwordHash: _ph, ...safeUser } = user;

    req.log.info({ userId: user.id }, "User registered");
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    req.log.error(err, "Register failed");
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ─── Login ─── */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });
    const { passwordHash: _ph, ...safeUser } = user;

    req.log.info({ userId: user.id }, "User logged in");
    res.json({ token, user: safeUser });
  } catch (err) {
    req.log.error(err, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

/* ─── Me ─── */
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { passwordHash: _ph, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    req.log.error(err, "Me failed");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/* ─── Update Profile ─── */
router.patch("/auth/me", requireAuth, async (req, res) => {
  const { name, bio, preferredCurrency, avatarUrl } = req.body as {
    name?: string;
    bio?: string;
    preferredCurrency?: string;
    avatarUrl?: string;
  };

  try {
    const updates: Partial<typeof usersTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (preferredCurrency) updates.preferredCurrency = preferredCurrency;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, req.user!.userId))
      .returning();

    const { passwordHash: _ph, ...safeUser } = updated;
    res.json({ user: safeUser });
  } catch (err) {
    req.log.error(err, "Profile update failed");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* ─── Delete Account (Play Store required) ─── */
router.delete("/auth/account", requireAuth, async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, req.user!.userId));
    req.log.info({ userId: req.user!.userId }, "Account deleted");
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Account deletion failed");
    res.status(500).json({ error: "Failed to delete account" });
  }
});

/* ─── Logout (client-side token discard, server ack) ─── */
router.post("/auth/logout", requireAuth, (_req, res) => {
  res.json({ success: true });
});

export default router;
