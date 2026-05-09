import { and, eq, or } from "drizzle-orm";
import { Router } from "express";
import { db, tripsTable, tripMembersTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function generateShareToken(destination: string): string {
  const prefix = destination.toLowerCase().slice(0, 4).replace(/[^a-z]/g, "x");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${rand}`;
}

/* ─── List trips for current user ─── */
router.get("/trips", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const memberRows = await db
      .select({ tripId: tripMembersTable.tripId })
      .from(tripMembersTable)
      .where(eq(tripMembersTable.userId, userId));

    const tripIds = memberRows.map((r) => r.tripId);

    const owned = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.ownerId, userId));

    const memberTrips =
      tripIds.length > 0
        ? await db
            .select()
            .from(tripsTable)
            .where(
              and(
                eq(tripsTable.id, tripIds[0]),
              )
            )
        : [];

    const all = [...owned];
    for (const t of memberTrips) {
      if (!all.find((x) => x.id === t.id)) all.push(t);
    }

    const tripsWithMembers = await Promise.all(
      all.map(async (trip) => {
        const members = await db
          .select({
            id: tripMembersTable.id,
            userId: tripMembersTable.userId,
            role: tripMembersTable.role,
            name: usersTable.name,
            email: usersTable.email,
            avatarUrl: usersTable.avatarUrl,
          })
          .from(tripMembersTable)
          .leftJoin(usersTable, eq(tripMembersTable.userId, usersTable.id))
          .where(eq(tripMembersTable.tripId, trip.id));

        return { ...trip, members };
      })
    );

    res.json({ trips: tripsWithMembers });
  } catch (err) {
    req.log.error(err, "List trips failed");
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

/* ─── Get single trip ─── */
router.get("/trips/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const tripId = req.params.id;

    const [trip] = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.id, tripId))
      .limit(1);

    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    const isMember =
      trip.ownerId === userId ||
      (
        await db
          .select({ id: tripMembersTable.id })
          .from(tripMembersTable)
          .where(
            and(
              eq(tripMembersTable.tripId, tripId),
              eq(tripMembersTable.userId, userId)
            )
          )
          .limit(1)
      ).length > 0;

    if (!isMember) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const members = await db
      .select({
        id: tripMembersTable.id,
        userId: tripMembersTable.userId,
        role: tripMembersTable.role,
        name: usersTable.name,
        email: usersTable.email,
        avatarUrl: usersTable.avatarUrl,
      })
      .from(tripMembersTable)
      .leftJoin(usersTable, eq(tripMembersTable.userId, usersTable.id))
      .where(eq(tripMembersTable.tripId, tripId));

    res.json({ trip: { ...trip, members } });
  } catch (err) {
    req.log.error(err, "Get trip failed");
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

/* ─── Create trip ─── */
router.post("/trips", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const {
    title,
    destination,
    country,
    startDate,
    endDate,
    currency,
    estimatedBudget,
    accentColor,
    notes,
    status,
  } = req.body as Record<string, string | number>;

  if (!title || !destination || !startDate || !endDate) {
    res.status(400).json({ error: "title, destination, startDate, endDate required" });
    return;
  }

  try {
    const shareToken = generateShareToken(String(destination));

    const [trip] = await db
      .insert(tripsTable)
      .values({
        ownerId: userId,
        title: String(title),
        destination: String(destination),
        country: country ? String(country) : "",
        startDate: String(startDate),
        endDate: String(endDate),
        currency: currency ? String(currency) : "USD",
        estimatedBudget: estimatedBudget ? Number(estimatedBudget) : 0,
        accentColor: accentColor ? String(accentColor) : "#7C6FF7",
        notes: notes ? String(notes) : "",
        status: (status as any) ?? "planning",
        shareToken,
      })
      .returning();

    await db.insert(tripMembersTable).values({
      tripId: trip.id,
      userId,
      role: "owner",
      invitationStatus: "accepted",
    });

    req.log.info({ tripId: trip.id, userId }, "Trip created");
    res.status(201).json({ trip: { ...trip, members: [] } });
  } catch (err) {
    req.log.error(err, "Create trip failed");
    res.status(500).json({ error: "Failed to create trip" });
  }
});

/* ─── Update trip ─── */
router.patch("/trips/:id", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const tripId = req.params.id;

  try {
    const [trip] = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.id, tripId))
      .limit(1);

    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    const memberRow = await db
      .select({ role: tripMembersTable.role })
      .from(tripMembersTable)
      .where(
        and(
          eq(tripMembersTable.tripId, tripId),
          eq(tripMembersTable.userId, userId)
        )
      )
      .limit(1);

    const isOwner = trip.ownerId === userId;
    const isEditor = memberRow.length > 0 && ["owner", "editor"].includes(memberRow[0].role);

    if (!isOwner && !isEditor) {
      res.status(403).json({ error: "Only owners and editors can update trips" });
      return;
    }

    const allowed = [
      "title", "destination", "country", "startDate", "endDate",
      "currency", "estimatedBudget", "accentColor", "notes", "status", "coverImageUrl",
    ];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const [updated] = await db
      .update(tripsTable)
      .set(updates)
      .where(eq(tripsTable.id, tripId))
      .returning();

    res.json({ trip: updated });
  } catch (err) {
    req.log.error(err, "Update trip failed");
    res.status(500).json({ error: "Failed to update trip" });
  }
});

/* ─── Delete trip ─── */
router.delete("/trips/:id", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const tripId = req.params.id;

  try {
    const [trip] = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.id, tripId))
      .limit(1);

    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    if (trip.ownerId !== userId) {
      res.status(403).json({ error: "Only the owner can delete a trip" });
      return;
    }

    await db.delete(tripsTable).where(eq(tripsTable.id, tripId));
    req.log.info({ tripId, userId }, "Trip deleted");
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Delete trip failed");
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

export default router;
